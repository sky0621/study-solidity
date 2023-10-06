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

ERC20 contract deploy address 0x01dFDC3F63410540D130D779677E6077e5e403Da
Transaction URL: https://sepolia.etherscan.io/tx/0x97cb0af0c91de10634f3b18535c4386e80dca329b3744eacad98e94bc07c9507

#### mint original token

at erc20/

```
ts-node scripts/mint.ts --network sepolia --contractAddress 0x01dFDC3F63410540D130D779677E6077e5e403Da --accountAddress 0x99999999 --amount 150
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

