# Scaffolding and Setup

Let's make sure we have docker installed
```
  $ make --version
  $ docker --version
  $ docker-compose --version
```

Once you’ve confirmed that they are installed, choose a directory for this project. We recommend
```
  $ mkdir -p ~/reach/lecture_0 && cd ~/reach/lecture_0
```
Next, install Reach by downloading it from GitHub by running
```
  $ curl https://raw.githubusercontent.com/reach-sh/reach-lang/master/reach -o reach ; chmod +x reach
```
You’ll know that the download worked if you can run
```
  $ ./reach version
```
Since Reach is Dockerized, when you first use it, you’ll need to download the images it uses. This will happen automatically when you first use it, but you can do it manually now by running
```
  $ ./reach update
```
You’ll know that everything is in order if you can run
```
  $ ./reach compile --help
```  
  
Let’s start by creating a file named index.rsh. It doesn’t matter where you put this file, but we recommend putting in the current directory, which would be ~/reach/tut if you’re following along exactly. In all the subsequent code samples, we’ll label the files based on the chapter of the tutorial you’re reading. For example, start off by typing the following into index.rsh:

```javascript
'reach 0.1';
```
indicates that this is a Reach program. You’ll always have this at the top of every program.
```javascript
export const main =
  Reach.App(
    {},
    [Participant('Alice', {}), Participant('Bob', {})],
    (A, B) => {
      exit(); });
```

The main export from the program. When you compile, this is what the compiler will look at.the two participants to this application, Alice and Bob. Finally, `Reach` identifiers (`A` and `B`) to these participants and defines the body of the program.

```javascript
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
  const getAccount = async () => acc.getAddress;

  const before = await getBalance();
  const account = await getAccount();
  console.log(`Your balance is ${before}`);
  console.log(`Your account address ${account}`);

  if (isAlice) {
    console.log('Alice Stuff... Public Address ${acc}');
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
```


Follow the video

[![](http://img.youtube.com/vi/OhwIbyhBcLQ/0.jpg)](http://www.youtube.com/watch?v=OhwIbyhBcLQ "FullStack Blockchain dApp Development == 0")


