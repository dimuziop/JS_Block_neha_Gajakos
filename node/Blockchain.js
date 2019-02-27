const SHA256 = require('crypto-js/sha256');
class Block {
	constructor(index, timestamp, data, previousHash=''){
		this.index = index;
		this.timestamp = timestamp;
		this.previousHash = previousHash;

		this.hash = this.calculateHash();
	}

	calculateHash(){
		return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
	}
}

class Blockchain {
	constructor(){
		this.chain = [this.createGenesisBlock()];
	}

	createGenesisBlock(){
		return new Block(0, "01/01/2017", "Genesis Block", "0");
	}

	getLatestBlock(){
		return this.chain[this.chain.length - 1];
	}

	addBlock(newBlock){
		newBlock.previousHash = this.getLatestBlock().hash;

		newBlock.hash = newBlock.calculateHash();
		this.chain.push(newBlock);
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
ourCrypto.addBlock(new Block(1,'10/07/2017',{amount: 4}));
ourCrypto.addBlock(new Block(2,'1/15/2018',{amount: 10}));

console.log(JSON.stringify(ourCrypto, null, 4));

console.log('Is our blockchain valid?' + ourCrypto.isChainValid());

ourCrypto.chain[1].data = {amount: 100};
ourCrypto.chain[1].hash = ourCrypto.chain[1].calculateHash();

console.log('Is our blockchain valid?' + ourCrypto.isChainValid());
