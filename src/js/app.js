App = {
  web3Provider: null,
  contracts: {},
  instances:{},
  account: '0x0',
  loading: false,

  init: async function() {
    App.initWeb3()
    App.loadContracts()
    App.loadAccount()
    App.render()
    console.log("loaded app.js")
  },

  initWeb3: async function() {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
  },

  loadContracts: async () => {
    
    const token = await $.getJSON('Token.json');
    App.contracts.Token = TruffleContract(token);
    App.contracts.Token.setProvider(App.web3Provider);
    App.instances.token = await App.contracts.Token.deployed();
    console.log("Token contract address: ",App.instances.token.address);
    
    
    const tokenSale = await $.getJSON('TokenSale.json');
    App.contracts.TokenSale = TruffleContract(tokenSale);
    App.contracts.TokenSale.setProvider(App.web3Provider);
    App.instances.tokenSale = await App.contracts.TokenSale.deployed();
    console.log("TokenSale contract address: ",App.instances.tokenSale.address);


  },
  loadAccount: async () => {
    // Set the current blockchain account
    // App.account=window.ethereum.currentProvider.selectedAddress;
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    App.account=accounts[0];
    $("#account-address").html("Your account: "+App.account);
  },

  render: async()=>{

    if(App.loading){
      return;
    }
    App.loading=true;

    var loader =$("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    const token = await $.getJSON('Token.json');
    App.contracts.Token = TruffleContract(token);
    App.contracts.Token.setProvider(App.web3Provider);
    App.instances.token = await App.contracts.Token.deployed();
    
    var name = await App.instances.token.tokenName();
    var symbol = await App.instances.token.tokenSymbol();
    var balance = await App.instances.token.balanceOf(App.account);
    
    const tokenSale = await $.getJSON('TokenSale.json');
    App.contracts.TokenSale = TruffleContract(tokenSale);
    App.contracts.TokenSale.setProvider(App.web3Provider);
    App.instances.tokenSale = await App.contracts.TokenSale.deployed();
    
    var price = await App.instances.tokenSale.tokenPrice();
    var sold= await App.instances.tokenSale.tokensSold();
    var available = await App.instances.token.balanceOf(App.instances.tokenSale.address);
    var progress= (sold/available)*100;

    $(".token-name").html(name);
    $(".token-symbol").html(symbol);
    $(".token-balance").html(balance.toNumber());
    $(".token-price").html(web3.fromWei(price,"ether").toNumber());
    $(".tokens-sold").html(sold.toNumber());
    $(".tokens-available").html(available.toNumber());
    $("#progress").css('width',progress+'%');

    App.loading=false;
    loader.hide();
    content.show();
  },

  buyToken: async()=>{
    var numberOfTokens= $("#numberOfTokens").val();
    var price = await App.instances.tokenSale.tokenPrice();

    var result = await App.instances.tokenSale.buyTokens(numberOfTokens,{from: App.account,value: numberOfTokens*price,gas:500000});
    $('form').trigger('reset');   
  
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
