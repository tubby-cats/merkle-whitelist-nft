//SPDX-License-Identifier: CC0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./MultisigOwnable.sol";

contract WhitelistedSale is ERC721, MultisigOwnable {
    using Strings for uint256;

    bytes32 public merkleRoot;
    string public baseURI;
    bool public finalized = false;
    uint public constant MAX_SUPPLY = 10e3;
    uint public constant price = 0.1 ether;
    uint public totalSupply = 0; 

    constructor(bytes32 _merkleRoot, string memory _baseURI)
        ERC721("Tubby Cats", "TUBBY")
    {
        merkleRoot = _merkleRoot;
        baseURI = _baseURI;
    }

    function setParams(string memory newBaseURI, bool newFinal, bytes32 newMerkleRoot) external onlyRealOwner {
        require(finalized == false, "final");
        merkleRoot = newMerkleRoot;
        baseURI = newBaseURI;
        finalized = newFinal;
    }

    function retrieveFunds(address payable to) external onlyRealOwner {
        to.transfer(address(this).balance);
    }

    function toBytes32(address addr) pure internal returns (bytes32){
        return bytes32(uint256(uint160(addr)));
    }

    // CAUTION: Never introduce any kind of batch processing for mint() or mintFromSale() since then people can
    // execute the same bug that appeared on sushi's bitDAO auction
    // There are some issues with merkle trees such as pre-image attacks or possibly duplicated leaves on
    // unbalanced trees, but here we protect against them by checking against msg.sender and only allowing each account to claim once
    // See https://github.com/miguelmota/merkletreejs#notes for more info
    mapping(address=>bool) public claimed;
    function mint(bytes32[] calldata _merkleProof) public payable {
        require((totalSupply + 1) <= MAX_SUPPLY, "limit reached");
        require(claimed[msg.sender] == false, "already claimed");
        claimed[msg.sender] = true;
        require(MerkleProof.verify(_merkleProof, merkleRoot, toBytes32(msg.sender)) == true, "wrong merkle proof");
        require(msg.value == price, "wrong payment");
        _mint(msg.sender, totalSupply);
        unchecked {
            totalSupply++;   
        }
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        return string(abi.encodePacked(baseURI, id.toString(), ".json"));
    }
}
