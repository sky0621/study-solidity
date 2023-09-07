# study-solidity

## project setup

### setup typescript

```
npm init -y
```

```
npm install --save-dev hardhat
```

### setup hardhat

```
npx hardhat
```

#### compile

```
npx hardhat compile
```

#### test

```
npx hardhat test
```

```
npx hardhat coverage
```

### ERC20

#### deploy original token

at erc20/

```
ts-node scripts/deploy.ts --name SkyToken --symbol SKYT --decimals 18
```

ERC20 contract deploy address 0x7629AB8DcD7a07a8Eb299F5f983b6024c530536c
Transaction URL: https://sepolia.etherscan.io/tx/0x72e7345da4d25f47775f5ab6aab45ac53d81a09b0dc24ed4e2538aa06451582b

#### mint original token

at erc20/

```
ts-node scripts/mint.ts --network sepolia --contractAddress 0x7629AB8DcD7a07a8Eb299F5f983b6024c530536c --accountAddress 0x99999999 --amount 150
```

## install

### commander

```
npm install commander --save-dev
```

### dotenv

```
npm install dotenv --save-dev
```

## memo

```
export $(cat .env | xargs)
```

