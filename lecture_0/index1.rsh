'reach 0.1';

const Alice = {
    cost:UInt
};

const Bob = {
    acceptCost:Fun([UInt], Null)
};
export const main =
    Reach.App(
        {},
        [Participant('Alice', Alice), Participant('Bob', Bob)],
        (A, B) => {
            A.only(() => {
                const cost = declassify(interact.cost);});
            A.publish(cost)
                .pay(cost);
            commit();

            B.only(() => {
                interact.acceptCost(cost);
            }).pay(cost);
            commit();
            exit();
        });