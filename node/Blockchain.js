const SHA256 = require('crypto-js/sha256');
class Block {
	constructor(index, timestamp, data, previousHash=''){
		this.index = index;
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
	}

	createGenesisBlock(){
		return new Block(0, "01/01/2017", "Genesis Block", "0");
	}

	getLatestBlock(){
		return this.chain[this.chain.length - 1];
	}

	addBlock(newBlock){
		newBlock.previousHash = this.getLatestBlock().hash;

		newBlock.mineBlock(this.difficulty);
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
console.log("MinningBlock 1");
ourCrypto.addBlock(new Block(1, "1/01/2018", {amount: 5}));
console.log("MinningBlock 2");
ourCrypto.addBlock(new Block(2, "1/01/2019", {amount: 32}));

console.log(JSON.stringify(ourCrypto, null, 4));
console.log('Is blockchain valid?' + ourCrypto.isChainValid().toString());
