const SHA256 = require('crypto-js/sha256');

class Transaction {
	constructor(fromAddress, toAddress, amount) {
		this.fromAddress = fromAddress;
		this.toAddress = toAddress;
		this.amount = amount;
	}
}

class Block {
	constructor(timestamp, transactions, data, previousHash=''){
		this.transactions = transactions;
		this.timestamp = timestamp;
		this.previousHash = previousHash;
    this.data = data;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}

	calculateHash(){
		return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
	}

	mineBlock(difficulty) {
		while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
			this.nonce++;
			this.hash = this.calculateHash();
		}
		console.log("Block mined: " + this.hash);
	}
}

class Blockchain {
	constructor(){
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 4;
		this.pendingTransactions = [];
		this.miningReward = 100;
	}

	createGenesisBlock(){
		return new Block(0, "01/01/2017", "Genesis Block", "0");
	}

	getLatestBlock(){
		return this.chain[this.chain.length - 1];
	}

	minePendingTransactions(miningRewardAddress){
		let block = new Block(Date.now(), this.pendingTransactions)
		block.mineBlock(this.difficulty);
		this.pendingTransactions = [
				new Transaction(null, miningRewardAddress, this.miningReward)
		];
		console.log('block successfully mined');
		this.chain.push(block);
	}

	addTransaction(transaction){
		this.pendingTransactions.push(transaction);
	}

	getBalanceOfAddress(address){
		let balance =  0;

		for (const block of this.chain){
			for (const trans of block.transactions){
				if(trans.fromAddress === address){
					balance -= trans.amount;
				}

				if(trans.toAddress === address){
					balance += trans.amount;
				}
			}
		}
		return balance;
	}

	isChainValid(){
		for(let i = 1; i < this.chain.length; i++){
			const curentBlock = this.chain[i];
			const previousBlock = this.chain[i - 1];

			if(curentBlock.hash !== curentBlock.calculateHash()){
				return false;
			}

			if(curentBlock.previousHash !== previousBlock.hash){
				return false;
			}
		}

		return true
	}
}

let ourCrypto = new Blockchain();
ourCrypto.addTransaction(new Transaction('address1', 'address2', 400));
ourCrypto.addTransaction(new Transaction('address2', 'address1', 150));

console.log('\nStarting the miner.');
ourCrypto.minePendingTransactions('our-address');
console.log('\nThe account balance is: ', ourCrypto.getBalanceOfAddress('our-address'));

console.log('\nStarting the miner a second time.');
ourCrypto.minePendingTransactions('our-address');
console.log('\nThe account balance is: ', ourCrypto.getBalanceOfAddress('our-address'));

console.log('\nStarting the miner a third time.');
ourCrypto.minePendingTransactions('our-address');
console.log('\nThe account balance is: ', ourCrypto.getBalanceOfAddress('our-address'));
