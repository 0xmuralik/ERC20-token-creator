var Token = artifacts.require("Token");

module.exports = function(deployer){
    deployer.deploy(Token,"I Don't Count","IDC",8,10000);

}