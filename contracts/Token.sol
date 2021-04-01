pragma solidity >=0.4.22 <0.8.0;

contract Token{
    string public tokenName="I Don't Count";
    string public tokenSymbol="IDC";
    uint8 public decimals=8;
    uint256 public totalSupply=1000;

    mapping(address=>uint256) public balanceOf;
    mapping(address=>mapping(address=>uint256)) public allownace;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    
    constructor(){
        balanceOf[msg.sender]=totalSupply;
    }

    function transfer(address _from,address _to, uint256 _value) public returns(bool success){
        require(balanceOf[from]>=_value);
        balanceOf[from]-=_value;
        balanceOf[to]+=_value;

        event Transfer(_from,_to,_value);

        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success){
        allownace[msg.sender][_spender] = _value;

        Approval(msg.sender, _spender, _value);

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
        require(balanceOf[_from]>=_value);
        require(allowance[_from][_to]>=_value);

        allownace[_from][_to]-=_value;
        balanceOf[_from]-=_value;
        balanceOf[_to]+=value;

        Transfer(_from, _to, _value);

        return true;
    }
}