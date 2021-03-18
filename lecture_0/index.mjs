import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
import { ask, yesno, done } from '@reach-sh/stdlib/ask.mjs';

(async () => {
  const stdlib = await loadStdlib();

  const isAlice = await ask(
      `Are you Alice?`,
      yesno
  );
  const who = isAlice ? 'Alice' : 'Bob';

  console.log(`Alice and Bob Template! as ${who}`);

  let acc = null;
  const createAcc = await ask(
      `Would you like to create an account? (only possible on devnet)`,
      yesno
  );
  if (createAcc) {
    acc = await stdlib.newTestAccount(stdlib.parseCurrency(1000));
  } else {
    const secret = await ask(
        `What is your account secret?`,
        (x => x)
    );
    acc = await stdlib.newAccountFromSecret(secret);
  }

  let ctc = null;
  const deployCtc = await ask(
      `Do you want to deploy the contract? (y/n)`,
      yesno
  );
  if (deployCtc) {
    ctc = acc.deploy(backend);
    const info = await ctc.getInfo();
    console.log(`The contract is deployed ${stdlib.balanceOf(acc)} as = ${JSON.stringify(info)}`);
  } else {
    const info = await ask(
        `Please paste the contract information:`,
        JSON.parse
    );
    ctc = acc.attach(backend, info);
  }

  const fmt = (x) => stdlib.formatCurrency(x, 4);
  const getBalance = async () => fmt(await stdlib.balanceOf(acc));

  const before = await getBalance();
  console.log(`Your balance is ${before}`);

  if (isAlice) {
    console.log('Alice Stuff...');
  } else {
    console.log('Do Bob Stuff');
  }

  const part = isAlice ? backend.Alice : backend.Bob;
  // await the attach
  //await part(ctc, interact);
  await part(ctc);

  const after = await getBalance();
  console.log(`Your balance is now ${after} `);

  done();
})();