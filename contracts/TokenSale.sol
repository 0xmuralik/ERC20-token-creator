pragma solidity >=0.4.22 <0.8.0;
import "./Token.sol";

contract TokenSale{
    address payable admin;
    Token public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address _buyer,uint256 _tokens);

    constructor(Token _tokenContract, uint256 _tokenPrice, uint _tokensForSale) public {
        admin = msg.sender;
        tokenContract=_tokenContract;
        tokenPrice=_tokenPrice;

        require(tokenContract.balanceOf(admin)>=_tokensForSale);
        require(tokenContract.transfer(admin, address(this), _tokensForSale));
    }

    function multiply(uint x, uint y) internal pure returns(uint z){
        require(y==0||(z=x*y)/y==x);
    }

    function buyTokens(uint _numberOfTokens) public payable{
        require(msg.value==multiply(_numberOfTokens,tokenPrice));
        require(tokenContract.balanceOf(address(this))>=_numberOfTokens);
        require(tokenContract.transfer(address(this), msg.sender, _numberOfTokens));


        tokensSold+=_numberOfTokens;

        emit Sell(msg.sender, _numberOfTokens);       
    }

    function endSale() public {
        require(msg.sender==admin);

        tokenContract.transfer(address(this), admin, tokenContract.balanceOf(address(this)));

        admin.transfer(address(this).balance);
    }
}