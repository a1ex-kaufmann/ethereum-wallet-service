
var key;
var key2;

function generate_seed()
{
	var new_seed = lightwallet.keystore.generateRandomSeed();

	document.getElementById("seed").value = new_seed;

	generate_addresses(new_seed);
}

var totalAddresses = 0;

function generate_addresses(seed)
{
	if(seed == undefined)
	{
		seed = document.getElementById("seed").value;
	}

	if(!lightwallet.keystore.isSeedValid(seed))
	{
		document.getElementById("info").innerHTML = "Please enter a valid seed";
		return;
	}

	totalAddresses = prompt("How many addresses do you want to generate");

	if(!Number.isInteger(parseInt(totalAddresses)))
	{
		document.getElementById("info").innerHTML = "Please enter valid number of addresses";
		return;
	}

	var password = Math.random().toString();

	lightwallet.keystore.createVault({
		password: password,
		seedPhrase: seed
	}, function (err, ks) {
		ks.keyFromPassword(password, function (err, pwDerivedKey) {
			if (err) {
				document.getElementById("info").innerHTML = err;
			}
			else {
				ks.generateNewAddress(pwDerivedKey, totalAddresses);
				var addresses = ks.getAddresses();
	    		
				var web3 = new Web3(new Web3.providers.HttpProvider("https://node.joys.digital"));

				var html = "";

				var setAccountInfo = function (address, private_key) {
					web3.eth.getBalance("0x" + address)
					.then((res) => {
						html = html + "<li>";
						html = html + "<p><b>Address: </b>0x" + address + "</p>";
						html = html + "<p><b>Private Key: </b>0x" + private_key + "</p>";
						html = html + "<p><b>Balance: </b>" + web3.utils.fromWei(res, "ether").toString() + " ether</p>";
						html = html + "</li>";
						document.getElementById("list").innerHTML = html;
					})
					return
				}

	    		for(var count = 0; count < addresses.length; count++)
				{
					var address = addresses[count];
					var private_key = ks.exportPrivateKey(address, pwDerivedKey);
					setAccountInfo(address, private_key);
	    		}
	    	}
	  	});
	});
}

function send_ether()
{
	var	seed = document.getElementById("seed").value;

	if(!lightwallet.keystore.isSeedValid(seed))
	{
		document.getElementById("info").innerHTML = "Please enter a valid seed";
		return;
	}

	var password = Math.random().toString();

	lightwallet.keystore.createVault({
		password: password,
	  	seedPhrase: seed
	}, function (err, ks) {
	  	ks.keyFromPassword(password, function (err, pwDerivedKey) {
	    	if(err)
	    	{
	    		document.getElementById("info").innerHTML = err;
	    	}
	    	else
			{
				
				key = ks;
				key2 = pwDerivedKey;
				ks.generateNewAddress(pwDerivedKey, totalAddresses);
				
				// console.log(ks);


			    var web3 = new Web3(new Web3.providers.HttpProvider("https://node.joys.digital"));

			    var from = document.getElementById("address1").value;
				var to = document.getElementById("address2").value;
				var value = web3.utils.toWei(document.getElementById("ether").value, "ether");
				
				
				var prv_key = ks.exportPrivateKey(from, pwDerivedKey);
  				// console.log('address and key: ' + from  + " " + prv_key);
				
				const tx = {
					gas: "21000",
					gasPrice: "0x04e3b29200", // 10 Gwei
					to: to,
					from: from,
					value: "0x123456",
					data: "",
					chainId: 35855456
				}

				web3.eth.accounts.signTransaction(
					tx,
					prv_key
				).then((res, err) => {
					console.log(res, err);
					if(err)
					{	
			    		document.getElementById("info").innerHTML = err;
					} else {
						document.getElementById("info").innerHTML = "Txn hash: " + res.transactionHash;
						return web3.eth.sendSignedTransaction(
      					res.rawTransaction
    				)
					}
				})
				.then((res, err) => {
					if(err)
					{	
						console.log(err);
			    		document.getElementById("info").innerHTML = err;
			    	}
				})

	    	}
	  	});
	});
}