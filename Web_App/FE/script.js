$(document).ready(function () {
    let conAddress = "0xEE4fb72da9AeaEc2D8A1E4a21fC9f3E0F507Dd3E"
    let abi = '[{"inputs":[],"name":"getval","outputs":[{"components":[{"internalType":"int256","name":"t","type":"int256"},{"internalType":"uint256","name":"h","type":"uint256"},{"internalType":"int256","name":"hI","type":"int256"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"internalType":"structCrudApp.Temp[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"int256","name":"t","type":"int256"},{"internalType":"uint256","name":"h","type":"uint256"},{"internalType":"int256","name":"hI","type":"int256"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"internalType":"structCrudApp.Temp","name":"recTemp","type":"tuple"}],"name":"setval","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"weatherdb","outputs":[{"internalType":"int256","name":"t","type":"int256"},{"internalType":"uint256","name":"h","type":"uint256"},{"internalType":"int256","name":"hI","type":"int256"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"stateMutability":"view","type":"function"}]';
    let account = "0xd5a84c66d68001aBbe27569A1df9C83D4f1d1F4c";
    const web3 = new Web3("http://172.27.63.201:7545");
    //const web3 = new Web3("http://192.168.137.216:7545");
    let deploy_contract = new web3.eth.Contract(JSON.parse(abi), conAddress);
    let latestKnownBlockNumber = -1;
    let blockTime = 5000;
    var i = 0;
    // Our function that will triggered for every block
    async function processBlock(blockNumber) {
        console.log("We process block: " + blockNumber);
        let block = await web3.eth.getBlock(blockNumber);
        console.log("new block :", block)

        for (const transactionHash of block.transactions) {
            let transaction = await web3.eth.getTransaction(transactionHash);
            let transactionReceipt = await web3.eth.getTransactionReceipt(transactionHash);
            transaction = Object.assign(transaction, transactionReceipt);
            console.log("Transaction: ", transaction);
            var li = $('<div class="expandable-item" onclick="toggle(' + i + ')"><div class="expandable-header">Hash: ' +
                transaction.hash +
                '<div class="expandable-icon"><div class="line"></div><div class="line"></div></div></div><div class="expandable-body"><div class="container">' +
                format_division(transaction.blockHash, "Block Hash") + format_division(transaction.blockNumber, "Block Number") + format_division(transaction.from, "From") + format_division(transaction.to, "To")
                + '</div></div></div>');
            $('#json').append(li);
            i++;
        }
        latestKnownBlockNumber = blockNumber;
    }


    // This function is called every blockTime, check the current block number and order the processing of the new block(s)
    async function checkCurrentBlock() {
        const currentBlockNumber = await web3.eth.getBlockNumber()
        console.log("Current blockchain top: " + currentBlockNumber, " | Script is at: " + latestKnownBlockNumber);
        for (var i = 0; i <= currentBlockNumber; i++) {
            await processBlock(i);
        }
    }

    checkCurrentBlock()
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function draw_graphs() {
        var value = await deploy_contract.methods.getval().call();
        console.log("value in graph")
        console.log(value);
        var pre_temp = [];
        var pre_hum = [];
        for (var i = 2; i < value.length; i++) {
            pre_temp[i - 2] = { y: parseInt(value[i].timestamp), a: parseInt(value[i].t) };
            pre_hum[i - 2] = { y: parseInt(value[i].timestamp), a: parseInt(value[i].h) }
        }
        console.log("Pre temp = ");
        console.log(pre_temp);
        var temp = pre_temp,
            config = {
                data: temp,
                xkey: 'y',
                ykeys: ['a'],
                labels: ['Temperature °C'],
                fillOpacity: 0.6,
                hideHover: 'auto',
                behaveLikeLine: true,
                resize: true,
                pointFillColors: ['#ffffff'],
                pointStrokeColors: ['#de6fa1'],
                lineColors: ['#de6fa1'],
                barColors: ['#de6fa1']
            };
        config.element = 'temp-chart';
        Morris.Line(config);

        var hum = pre_hum,
            config = {
                data: hum,
                xkey: 'y',
                ykeys: ['a'],
                labels: ['Humidity %'],
                fillOpacity: 0.6,
                hideHover: 'auto',
                behaveLikeLine: true,
                resize: true,
                pointFillColors: ['#ffffff'],
                pointStrokeColors: ['#de6fa1'],
                lineColors: ['#de6fa1'],
                barColors: ['#de6fa1']
            };
        config.element = 'hum-chart';
        Morris.Line(config);
        $('#main_temp').append(parseInt(value[value.length - 1].t) + "°C");
        $('#feel-0').append(parseInt(value[value.length - 1].hI) + "°C");
        var all_data = ""
        for (var i = 0; i < value.length; i++) {
            all_data += '<div class="row" style="border-style:solid"><div class="col" style="border-right-style: dotted;">' + value[i].t + '</div><div class="col" style="border-left-style: dotted;border-right-style: dotted;">' + value[i].h + '</div><div class="col" style="border-left-style: dotted;border-right-style: dotted;">' + value[i].hI + '</div><div class="col" style="border-left-style: dotted;">' + value[i].timestamp + '</div></div>';
            //all_data += "<ul><span>" + value[i].t + " </span><span> " + value[i].h + " </span><span> " + value[i].hI + " </span><span> " + value[i].timestamp + "</span></ul>"
        }
        $('#all_data').append(all_data);
    }
    draw_graphs();
});

toggle = (idx) => {
    document.querySelectorAll('.expandable-item')[idx].classList.toggle('active');
}

function format_division(parameter, title) {
    return '<div class="row"><div class="col-sm-4">' + title + '</div><div class="col-sm-8">' + parameter + '</div></div>';
}


var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("dot");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}


