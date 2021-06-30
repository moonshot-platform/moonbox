// SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Moonbox is Context, Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    mapping (uint256 => uint256) moonboxPrice;

    address public transferAddress;
    address public authAddress;
    address public feeAddress;
    address public paymentTokenAddress;

    uint256 totalBets;
    mapping(uint256 => address) public claimedBet;
    mapping(uint256 => uint256) public claimedBetAmount;

    event Bet(uint256 indexed bet, uint256 amount, address account, uint256 moonboxID, uint256 seed, uint256 nonce);
    event ClaimBet(uint256 indexed bet, uint256 amount, address account, uint256 moonboxID, uint256 seed, uint256 nonce);
    event UpdateMoonbox(uint256 indexed id, uint256 price);

    constructor() public {}

    function submitBets(uint256 moonboxID, uint256 seed, uint256 bets) public nonReentrant {
        uint256 price = moonboxPrice[moonboxID]; 
        require(price > 0, "Moonbox::submitBets: Invalid moonbox");
        require(bets > 0, "Moonbox::submitBets: Must place bets");

        totalBets = totalBets.add(1);
        claimedBet[totalBets] = _msgSender();
        claimedBetAmount[totalBets] = bets;
        emit Bet(totalBets, bets, _msgSender(), moonboxID, seed, 1);

        uint256 cost = moonboxPrice[moonboxID].mul(1e9).mul(bets);
        IERC20(moonboxPaymentToken[moonboxID]).transferFrom(_msgSender(), feeAddress, cost);
    }

    function redeemBulk(address nftAsset, uint256[] calldata id, uint256[] calldata nftAmount, uint256 bet, uint8 v, bytes32 r, bytes32 s) public nonReentrant {
        require(claimedBet[bet] == _msgSender(), "Moonbox::redeemBulk: Invalid bet");
        bytes32 hash = keccak256(abi.encode(nftAsset, id, nftAmount, bet));
        address signer = ecrecover(hash, v, r, s);
        require(signer == authAddress, "Invalid signature");
        claimedBet[bet] = address(0);
        IERC1155(nftAsset).safeBatchTransferFrom(transferAddress, _msgSender(), id, nftAmount, "");
    }

    function setPaymentTokenAddress(address _address) public onlyOwner {
        require(_address != address(0));
        paymentTokenAddress = _address;
    }

    function setTransferAddress(address _address) public onlyOwner {
        require(_address != address(0));
        transferAddress = _address;
    }

    function setAuthAddress(address _address) public onlyOwner {
        require(_address != address(0));
        authAddress = _address;
    }

    function setFeeAddress(address _address) public onlyOwner {
        require(_address != address(0));
        feeAddress = _address;
    }

    function updateMoonbox(uint256 id, uint256 price) public onlyOwner {
        moonboxPrice[id] = price;
        emit UpdateMoonbox(id, price);
    }
}
