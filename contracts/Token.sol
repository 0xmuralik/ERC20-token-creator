pragma solidity >=0.4.22 <0.8.0;

contract Token{
    string public tokenName="I Don't Count";
    string public tokenSymbol="IDC";
    uint8 public decimals=8;
    uint256 public totalSupply=1000;

    mapping(address=>uint256) public balanceOf;
    mapping(address=>mapping(address=>uint256)) public allowance;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    
    constructor() public {
        balanceOf[msg.sender]=totalSupply;
    }

    function transfer(address _from,address _to, uint256 _value) public returns(bool success){
        require(balanceOf[_from]>=_value);
        balanceOf[_from]-=_value;
        balanceOf[_to]+=_value;

        emit Transfer(_from,_to,_value);

        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success){
        allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
        require(balanceOf[_from]>=_value);
        require(allowance[_from][msg.sender]>=_value);

        allowance[_from][msg.sender]-=_value;
        balanceOf[_from]-=_value;
        balanceOf[_to]+=_value;

        emit Transfer(_from, _to, _value);

        return true;
    }
}