// SPDX-License-Identifier: Unlicensed

pragma solidity 0.7.6;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract MoonboxNFT is ERC1155, Ownable, ReentrancyGuard {
    mapping(address => bool) public isMinter;

    constructor() ERC1155("https://app.project-moonshot.me/api/item/{id}") {
        setMinter(owner(), true);
    }

    function setMinter(address minter, bool status) public nonReentrant onlyOwner {
        isMinter[minter] = status;
    }

    function mint(address to, uint256 id, uint256 amount) public nonReentrant {
        require(isMinter[_msgSender()] == true, "MoonboxNFT::mint: Caller is not a minter");

        _mint(to, id, amount, "");
    }

    function burn(uint256 id, uint256 amount) public nonReentrant {
        _burn(_msgSender(), id, amount); 
    }

    function burnBatch(uint256[] memory ids, uint256[] memory amounts) public nonReentrant {
        _burnBatch(_msgSender(), ids, amounts);
    }

    function setURI(string memory newuri) public nonReentrant onlyOwner {
        _setURI(newuri);
    }
}
