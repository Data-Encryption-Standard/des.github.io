let msgDOM = document.getElementById('msg');
let keyDOM = document.getElementById('key');
let msgHex = '';
let keyHex = '';

function stringToHexadecimal() {
    msgDOM.value = (msgDOM.value).substring(0, 8);
    keyDOM.value = (keyDOM.value).substring(0, 8);
};

var modal = document.getElementById("myModal");

function encryptDES() {
    msgDOM.value = (msgDOM.value).substring(0, 8);
    keyDOM.value = (keyDOM.value).substring(0, 8);
    if(msgDOM.value.length <= 8 && keyDOM.value.length <= 8) {
        for (let i = 0; i < msgDOM.value.length; i++) {
            const charCode = msgDOM.value.charCodeAt(i);
            const hexValue = charCode.toString(16);
            msgHex += hexValue.padStart(2, '0');
        }
        msgHex = (msgHex.toUpperCase().replace(/[^0-9A-F]/, '') + '').substring(0, 16);

        for (let i = 0; i < keyDOM.value.length; i++) {
            const charCode1 = keyDOM.value.charCodeAt(i);
            const hexValue1 = charCode1.toString(16);
            keyHex += hexValue1.padStart(2, '0');
        }
        keyHex = (keyHex.toUpperCase().replace(/[^0-9A-F]/, '') + '').substring(0, 16);
    }


    if(msgDOM.value === '' || keyDOM.value === '') {
        return alert("Please the required fields")
    };
    if ( msgDOM.value.length != 8 ||  keyDOM.value.length != 8 )
    {
        return alert("Message and key must be 8 digits");
    };
    const msg = msgHex;
    const key = keyHex;
    let encryption = encrypt(msg, key, 200000000);
    document.getElementById("spinner").style = "display: block";
    const text = ["Initializing", "Converting", "Permutating", "Encoding", "Computing rounds", "Converting to hexadecimal"]
        
    document.getElementById("text").innerHTML = text[0].toString();
    setTimeout(function() {
        document.getElementById("text").innerHTML = text[1].toString();
    },500)
    setTimeout(function() {
        document.getElementById("text").innerHTML = text[2].toString();
    },1000)
    setTimeout(function() {
        document.getElementById("text").innerHTML = text[3].toString();
    },1500)
    setTimeout(function() {
        document.getElementById("text").innerHTML = text[4].toString();
    },2000)
    setTimeout(function() {
        document.getElementById("text").innerHTML = text[5].toString();
    },2500)
    setTimeout(function() {
        document.getElementById("spinner").style = "display: none";
        const output = document.getElementById('output');
        output.innerHTML = encryption;
        document.getElementById("desType").innerHTML = "Encryption"
        document.getElementById("desType").style = "padding: 1rem; font-size: 2rem;"
        document.getElementById("step8").style = "display: block"
        document.getElementById("step9").style = "display: block"
    }, 3000)
    modal.style.display = "none";
}

function encrypt(msg, key, numSteps) {

    
    /* Step 0 */
    let step = 0;
    let html = '<div style="background-color: white;; margin-right: 20px; padding: 40px 40px; border-radius: 20px; width: 30%;"><h3><span class="step" style="padding: 10px 20px; background-color: #DB6868; color: white; border-radius: 20px; font-weight: 500; font-size: 14px;">Step 0:</span><br><br> Initialization</h3>';
    html += 'Message: <br>' + msg + '<br>Key: <br>' + key +'</div>';

    /* Step 1 */
    if(step++ == numSteps) return html;
    html += '<div style="background-color: white;  position: absolute; z-index: -1; margin-top: -268px; margin-buttom: 40px; margin-left: 330px; padding: 20px 40px; border-radius: 20px; width: 52.5%;"><br><h3><span class="step" style="padding: 10px 20px; background-color: #6A68DB; color: white; border-radius: 20px; font-weight: 500; font-size: 14px;">Step 1:</span> <br><br>Convert to binary</h3>';

    let base2 = {
        '0': '0000',
        '1': '0001',
        '2': '0010',
        '3': '0011',
        '4': '0100',
        '5': '0101',
        '6': '0110',
        '7': '0111',
        '8': '1000',
        '9': '1001',
        'A': '1010',
        'B': '1011',
        'C': '1100',
        'D': '1101',
        'E': '1110',
        'F': '1111'
    }

    msg_2 = msg.split('').map(x => base2[x]).join('');
    html += 'Message in binary (64-bit):<br>' + formatBinary(msg_2);

    key_2 = key.split('').map(x => base2[x]).join('');
    html += '<br><br>Key in binary (64-bit):<br>' + formatBinary(key_2) + '</div>';


    /* Step 2 */
    if(step++ == numSteps) return html;
    html += '<div style="background-color: white; margin-top: 20px; padding: 20px 40px; border-radius: 20px; width: 98.7%;"><br><h3><span class="step" style="padding: 10px 20px; background-color: #FAA82D; color: white; border-radius: 20px; font-weight: 500; font-size: 14px;">Step 2:</span><br><br> Permute the key through the PC-1 table</h3>';

    html += 'Shuffle bits according to PC-1:<br><br>';

    const PC_1 = [
        57, 49, 41, 33, 25, 17, 9,
        1, 58, 50, 42, 34, 26, 18,
        10, 2, 59, 51, 43, 35, 27,
        19, 11, 3, 60, 52, 44, 36,
        63, 55, 47, 39, 31, 23, 15,
        7, 62, 54, 46, 38, 30, 22,
        14, 6, 61, 53, 45, 37, 29,
        21, 13, 5, 28, 20, 12, 4
    ];

    html += '<table border="1" cellpadding="5" style="background-color: #FFF; border: 1px solid red;">';
    let count = 0;
    for(let i = 0; i < 8; i++) {
        html += '<tr>';
        for(let j = 0; j < 7; j++) {
            html += '<td>';
            html += PC_1[count];
            html += '</td>';
            count++;
        }
        html += '</tr>';
    }
    html += '</table>';

    let newKey = '';
    for(i of PC_1) newKey += key_2[i - 1];

    html += '<br>Key after PC-1 (56-bit):<br>' + formatBinary(newKey) + '</div>';

    html += '</div>';


    /* Step 3 */
    if(step++ == numSteps) return html;
    html += '<div style="background-color: white;margin-top:20px; padding: 20px 40px; border-radius: 20px; width: 98.7%;"><br><h3><span class="step" style="padding: 10px 20px; background-color: #CB2E9F; color: white; border-radius: 20px; font-weight: 500; font-size: 14px;">Step 3:</span> <br><br>Rotating each half</h3>Split the key in half, then left rotate each bit according to the table:<br><br>';

    let rotationTable = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

    html += '<table border="1" cellpadding="5" style="background-color: #FFF; border: 1px solid red;"><tr>';
    html += '<td>Round</td><td>' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].join('</td><td>') + '</td>';
    html += '</tr><tr>';
    html += '<td>Rotations</td><td>' + rotationTable.join('</td><td>') + '</td>';
    html += '</tr></table>';

    let C = [newKey.substring(0, 28)];
    let D = [newKey.substring(28, 56)];
    html += '<br>C<sub>0</sub> = ' + formatBinary(C[0]);
    html += '<br>D<sub>0</sub> = ' + formatBinary(D[0]) + '<br><br>';
    for(let i = 0; i < 16; i++) {
        let newC = C[i],
            newD = D[i];

        let rotations = rotationTable[i];
        for(let j = 0; j < rotations; j++) {
            newC = newC.substring(1) + newC[0];
            newD = newD.substring(1) + newD[0];
        }
        C.push(newC);
        D.push(newD);
        html += '<br>Left rotate by ' + rotations + ' bit:';
        html += '<br>C<sub>' + (C.length - 1) + '</sub> = ' + formatBinary(C[C.length - 1]) ;
        html += '<br>D<sub>' + (D.length - 1) + '</sub> = ' + formatBinary(D[D.length - 1]) + '<br>';
        
    }
    html += '</div>';


    /* Step 4 */
    if(step++ == numSteps) return html;
    html += '<div style="background-color: white; padding: 20px 40px; border-radius: 20px; width: 98.7%;margin-top:20px;"><br><h3><span class="step" style="padding: 10px 20px; background-color: green; color: white; border-radius: 20px; font-weight: 500; font-size: 14px;">Step 4:</span> <br><br>Concatenation</h3><br>';
    html += 'Concatenate C and D:';
    let CD = [];
    for(let i = 0; i < 17; i++) {
        CD.push(C[i] + D[i]);

        html += '<br>CD<sub>' + i + '</sub> = ' + formatBinary(CD[i]);
        if(i == 0) html += '<br>';
    }

    html += '</div>';

    /* Step 5 */
    if(step++ == numSteps) return html;
    html += '<div style="background-color: white; padding: 20px 40px; border-radius: 20px; width: 98.7%; margin-top: 20px;"><br><h3><span class="step" style="padding: 10px 20px; background-color: #CB2E9F; color: white; border-radius: 20px; font-weight: 500; font-size: 14px;">Step 5:</span> <br><br>Permute the key through the PC-2 table</h3><br>';

    html += 'Shuffle bits according to PC-2 (48-bit):<br><br>';

    const PC_2 = [
        14, 17, 11, 24, 1, 5,
        3, 28, 15, 6, 21, 10,
        23, 19, 12, 4, 26, 8,
        16, 7, 27, 20, 13, 2,
        41, 52, 31, 37, 47, 55,
        30, 40, 51, 45, 33, 48,
        44, 49, 39, 56, 34, 53,
        46, 42, 50, 36, 29, 32
    ];

    html += '<table border="1" cellpadding="5" style="background-color: #FFF; border: 1px solid red;">';
    count = 0;
    for(let i = 0; i < 8; i++) {
        html += '<tr>';
        for(let j = 0; j < 6; j++) {
            html += '<td>';
            html += PC_2[count];
            html += '</td>';
            count++;
        }
        html += '</tr>';
    }
    html += '</table>';

    K = [];
    for(let i = 0; i < 17; i++) {
        newKey = ''
        for(j of PC_2) newKey += CD[i][j - 1];
        K.push(newKey);

        html += '<br>K<sub>' + i + '</sub> = ' + formatBinary(newKey);
        if(i == 0) html += '<br>';
    }

    html += '</div>';


    /* Step 6 */
    if(step++ == numSteps) return html;
    html += '<div style="background-color: white; padding: 20px 40px; border-radius: 20px; width: 98.7%; margin-top: 20px;"><br><h3><span class="step" style="padding: 10px 20px; background-color: red; color: white; border-radius: 20px; font-weight: 500; font-size: 14px;">Step 6:</span><br><br> Permute the message through IP</h3><br>';
    html += 'Shuffle bits according to the initial permutation (IP):<br><br>';

    const initialPermutation = [
        58, 50, 42, 34, 26, 18, 10, 2,
        60, 52, 44, 36, 28, 20, 12, 4,
        62, 54, 46, 38, 30, 22, 14, 6,
        64, 56, 48, 40, 32, 24, 16, 8,
        57, 49, 41, 33, 25, 17, 9, 1,
        59, 51, 43, 35, 27, 19, 11, 3,
        61, 53, 45, 37, 29, 21, 13, 5,
        63, 55, 47, 39, 31, 23, 15, 7
    ];

    html += '<table border="1" cellpadding="5" style="background-color: #FFF; border: 1px solid red;">';
    count = 0;
    for(let i = 0; i < 8; i++) {
        html += '<tr>';
        for(let j = 0; j < 8; j++) {
            html += '<td>';
            html += initialPermutation[count];
            html += '</td>';
            count++;
        }
        html += '</tr>';
    }
    html += '</table>';

    let IP = '';
    for(i of initialPermutation) IP += msg_2[i - 1];

    html += '<br>Original message (64-bit):<br>' + formatBinary(msg_2) + '<br>';
    html += '<br>Message after IP (64-bit):<br>' + formatBinary(IP) + '<br>';


    let L = [IP.substring(0, 32)];
    let R = [IP.substring(32, 64)];

    html += '</div>';


    /* Step 7 */
    if(step++ == numSteps) return html;
    html += '<div style="background-color: white; padding: 20px 40px; border-radius: 20px; width: 98.7%; margin-top: 20px;"><br><h3><span class="step" style="padding: 10px 20px; background-color: #EB8151; color: white; border-radius: 20px; font-weight: 500; font-size: 14px;">Step 7:</span><br><br> Encode the data</h3><br>';
    html += 'Splitting the resulting message into two halves:<br>';

    html += '<br>L<sub>0</sub> = ' + formatBinary(L[0]);
    html += '<br>R<sub>0</sub> = ' + formatBinary(R[0]) + '<br><br>';

    html += 'This can be expanded to 16 entries using the following formula<br>';
    html += 'L<sub>n</sub> = R<sub>n - 1</sub><br>';
    html += 'R<sub>n</sub> = L<sub>n - 1</sub> ⊕ <i>f</i>(R<sub>n - 1</sub>, K<sub>n</sub>)';
    html += '<br><br>Where <i>f</i> = <i>P</i>(<i>S</i>(K<sub>n</sub> ⊕ <i>E</i>(R<sub>n</sub>))), where <i>E</i> expands 32 bits into 48 bits using the following table:<br><br>';


    const expand = [
        32, 1, 2, 3, 4, 5,
        4, 5, 6, 7, 8, 9,
        8, 9, 10, 11, 12, 13,
        12, 13, 14, 15, 16, 17,
        16, 17, 18, 19, 20, 21,
        20, 21, 22, 23, 24, 25,
        24, 25, 26, 27, 28, 29,
        28, 29, 30, 31, 32, 1
    ];


    html += '<table border="1" cellpadding="5" style="background-color: #FFF; border: 1px solid red;">';
    count = 0;
    for(let i = 0; i < 8; i++) {
        html += '<tr>';
        for(let j = 0; j < 6; j++) {
            html += '<td>';
            html += expand[count];
            html += '</td>';
            count++;
        }
        html += '</tr>';
    }
    html += '</table>';

    let SBoxes = [];

    SBoxes.push([
        14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7,
        0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8,
        4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0,
        15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13
    ]);
    SBoxes.push([
        15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10,
        3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5,
        0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15,
        13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9
    ]);
    SBoxes.push([
        10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8,
        13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1,
        13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7,
        1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12
    ]);
    SBoxes.push([
        7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15,
        13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9,
        10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4,
        3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14
    ]);
    SBoxes.push([
        2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9,
        14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6,
        4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14,
        11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3
    ]);
    SBoxes.push([
        12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11,
        10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8,
        9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6,
        4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13
    ]);
    SBoxes.push([
        4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1,
        13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6,
        1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2,
        6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12
    ]);
    SBoxes.push([
        13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7,
        1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2,
        7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8,
        2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11
    ]);

    html += '<br>Then <i>S</i> splits the 48 bits into eight groups of six bits, and each group gets ran through the S-box as follows:<br>';
    html += '<ul>Given the first group of six bits, <i>abcdef</i>, consider <i>af</i> to be the row number, and <i>bcde</i> to be the column number in the following table:';

    html += '<br>S<sub>1</sub>:';
    html += '<table border="1" cellpadding="5" style="background-color: #FFF; border: 1px solid red;">';
    count = 0;
    for(let i = 0; i < 4; i++) {
        html += '<tr>';
        for(let j = 0; j < 16; j++) {
            html += '<td>';
            html += SBoxes[0][count];
            html += '</td>';
            count++;
        }
        html += '</tr>';
    }
    html += '</table>';

    html += '<br>The other seven groups have the following S-boxes:'

    html += '<br>S<sub>2</sub>:';
    html += '<table border="1" cellpadding="5" style="background-color: #FFF; border: 1px solid red;">';
    count = 0;
    for(let i = 0; i < 4; i++) {
        html += '<tr>';
        for(let j = 0; j < 16; j++) {
            html += '<td>';
            html += SBoxes[1][count];
            html += '</td>';
            count++;
        }
        html += '</tr>';
    }
    html += '</table>';

    html += '<br>S<sub>3</sub>:';
    html += '<table border="1" cellpadding="5" style="background-color: #FFF; border: 1px solid red;">';
    count = 0;
    for(let i = 0; i < 4; i++) {
        html += '<tr>';
        for(let j = 0; j < 16; j++) {
            html += '<td>';
            html += SBoxes[2][count];
            html += '</td>';
            count++;
        }
        html += '</tr>';
    }
    html += '</table>';

    html += '<br>S<sub>4</sub>:';
    html += '<table border="1" cellpadding="5" style="background-color: #FFF; border: 1px solid red;">';
    count = 0;
    for(let i = 0; i < 4; i++) {
        html += '<tr>';
        for(let j = 0; j < 16; j++) {
            html += '<td>';
            html += SBoxes[3][count];
            html += '</td>';
            count++;
        }
        html += '</tr>';
    }
    html += '</table>';

    html += '<br>S<sub>5</sub>:';
    html += '<table border="1" cellpadding="5" style="background-color: #FFF; border: 1px solid red;">';
    count = 0;
    for(let i = 0; i < 4; i++) {
        html += '<tr>';
        for(let j = 0; j < 16; j++) {
            html += '<td>';
            html += SBoxes[4][count];
            html += '</td>';
            count++;
        }
        html += '</tr>';
    }
    html += '</table>';

    html += '<br>S<sub>6</sub>:';
    html += '<table border="1" cellpadding="5" style="background-color: #FFF; border: 1px solid red;">';
    count = 0;
    for(let i = 0; i < 4; i++) {
        html += '<tr>';
        for(let j = 0; j < 16; j++) {
            html += '<td>';
            html += SBoxes[5][count];
            html += '</td>';
            count++;
        }
        html += '</tr>';
    }
    html += '</table>';

    html += '<br>S<sub>7</sub>:';
    html += '<table border="1" cellpadding="5" style="background-color: #FFF; border: 1px solid red;">';
    count = 0;
    for(let i = 0; i < 4; i++) {
        html += '<tr>';
        for(let j = 0; j < 16; j++) {
            html += '<td>';
            html += SBoxes[6][count];
            html += '</td>';
            count++;
        }
        html += '</tr>';
    }
    html += '</table>';

    html += '<br>S<sub>8</sub>:';
    html += '<table border="1" cellpadding="5" style="background-color: #FFF; border: 1px solid red;">';
    count = 0;
    for(let i = 0; i < 4; i++) {
        html += '<tr>';
        for(let j = 0; j < 16; j++) {
            html += '<td>';
            html += SBoxes[7][count];
            html += '</td>';
            count++;
        }
        html += '</tr>';
    }
    html += '</table>';

    html += '</ul>';


    const permute = [
        16, 7, 20, 21,
        29, 12, 28, 17,
        1, 15, 23, 26,
        5, 18, 31, 10,
        2, 8, 24, 14,
        32, 27, 3, 9,
        19, 13, 30, 6,
        22, 11, 4, 25
    ];

    html += '<br>Then finally, <i>P</i> mixes up the 32-bit output to get the output of <i>f</i>, using the following table:<br><br>';

    html += '<ul><table border="1" cellpadding="5" style="background-color: #FFF; border: 1px solid red;">';
    count = 0;
    for(let i = 0; i < 8; i++) {
        html += '<tr>';
        for(let j = 0; j < 4; j++) {
            html += '<td>';
            html += permute[count];
            html += '</td>';
            count++;
        }
        html += '</tr>';
    }
    html += '</table></ul><br>';

    html += '<hr>';

    html += 'Using the formula described previously:<br><br>';
    html += 'L<sub>n</sub> = R<sub>n - 1</sub><br>';
    html += 'R<sub>n</sub> = L<sub>n - 1</sub> ⊕ <i>f</i>(R<sub>n - 1</sub>, K<sub>n</sub>) where <i>f</i> = <i>S</i>(K<sub>n</sub> ⊕ <i>E</i>(R<sub>n</sub>)),';

    let xor = (s1, s2) => {
        s3 = '';
        for(let i = 0; i < s1.length; i++) {
            s3 += (s1[i] == '1') ^ (s2[i] == '1');
        }
        return s3;
    }

    let E = s => {
        output = '';
        let i;
        for(i of expand) output += s[i - 1];
        return output;
    }
    

    let S = s => {
        let output = '';
        let groups = s.match(/.{6}/g);
        for(let i = 0; i < groups.length; i++) {
            let group = groups[i];
            let SBox = SBoxes[i];
            let row = parseInt(group[0] + group[5], 2);
            let col = parseInt(group[1] + group[2] + group[3] + group[4], 2);
            let index = 16 * row + col;
            output += ('0000' + SBox[index].toString(2)).slice(-4);
        }
        return output;
    }

    let P = s => {
        output = '';
        let i;
        for(i of permute) output += s[i - 1];
        return output;
    }
    
    html += '<br><br>We get that:<br>';
    for(let i = 0; i < 16; i++) {
        html += '</div>';


        /* Step 8 */
        if(step++ == numSteps) return html;
        html += '<div style="background-color: white; padding: 20px 40px; border-radius: 20px; width: 98.7%; margin-top: 20px;"><br><h3><span class="step" style="padding: 10px 20px; background-color: #124B4B; color: white; border-radius: 20px; font-weight: 500; font-size: 14px;">Step ' + step + ':</span> <br><br>Computing ROUND ' + (i + 1) + '</h3>';

        let ER = E(R[i]);
        let KXORER = xor(K[i + 1], ER);
        let KXORERS = S(KXORER);
        let KXORERSP = P(KXORERS);

        L.push(R[i]);
        R.push(xor(L[i], KXORERSP));

        html += '<br>L<sub>' + i + '</sub> = ' + formatBinary(L[i]);
        html += '<br>R<sub>' + i + '</sub> = ' + formatBinary(R[i]);
        html += '<br>K<sub>' + (i + 1) + '</sub> = ' + formatBinary(K[i + 1]) + '<br><br>';

        html += '<i>E</i>(R<sub>' + i + '</sub>) = ' + formatBinary(ER);
        html += '<br>K<sub>' + (i + 1) + '</sub> ⊕ <i>E</i>(R<sub>' + i + '</sub>) = ' + formatBinary(KXORER);

        html += '<br><i>S</i>(K<sub>' + (i + 1) + '</sub> ⊕ <i>E</i>(R<sub>' + i + '</sub>)) = ' + formatBinary(KXORERS);

        html += '<br><i>f</i> = <i>P</i>(<i>S</i>(K<sub>' + (i + 1) + '</sub> ⊕ <i>E</i>(R<sub>' + i + '</sub>))) = ' + formatBinary(KXORERSP);



        html += '<br><br>L<sub>' + (i + 1) + '</sub> = ' + 'R<sub>' + i + '</sub> = ' + formatBinary(L[i + 1]);
        html += '<br>R<sub>' + (i + 1) + '</sub> = ' + 'L<sub>' + i + '</sub> ⊕ <i>f</i>(R<sub>' + i + '</sub>, K<sub>' + (i + 1) + '</sub>) = ' + formatBinary(R[i + 1]);
    }

    html += '</div>';

    /* Step 24 */
    if(step++ == numSteps) return html;
    html += '<div style="background-color: white; padding: 20px 40px; border-radius: 20px; width: 98.7%; margin-top: 20px;"><br><h3><span class="step" style="padding: 10px 20px; background-color: #5E64C7; color: white; border-radius: 20px; font-weight: 500; font-size: 14px;">Step 24:</span> <br><br>Permute the encoded data through the IP<sup>-1</sup> table</h3><br>';

    html += 'Now that we have'
    html += '<br><br>L<sub>16</sub> = ' + 'R<sub>15</sub> = ' + formatBinary(L[16]);
    html += '<br>R<sub>16</sub> = ' + 'L<sub>15</sub> ⊕ <i>f</i>(R<sub>15</sub>, K<sub>16</sub>) = ' + formatBinary(R[16]);
    html += '<br><br>Concatenate them backwards to get:<br>';

    let concat = R[16] + L[16];
    html += '<br>R<sub>16</sub>L<sub>16</sub> = ' + formatBinary(concat);

    const invIP = [
        40, 8, 48, 16, 56, 24, 64, 32,
        39, 7, 47, 15, 55, 23, 63, 31,
        38, 6, 46, 14, 54, 22, 62, 30,
        37, 5, 45, 13, 53, 21, 61, 29,
        36, 4, 44, 12, 52, 20, 60, 28,
        35, 3, 43, 11, 51, 19, 59, 27,
        34, 2, 42, 10, 50, 18, 58, 26,
        33, 1, 41, 9, 49, 17, 57, 25
    ];

    html += '<br>Then re-shuffle R<sub>16</sub>L<sub>16</sub> using the following IP<sup>-1</sup> table:<br>';


    html += '<table border="1" cellpadding="5" style="background-color: #FFF">';
    count = 0;
    for(let i = 0; i < 8; i++) {
        html += '<tr>';
        for(let j = 0; j < 8; j++) {
            html += '<td>';
            html += invIP[count];
            html += '</td>';
            count++;
        }
        html += '</tr>';
    }
    html += '</table>';

    html += '<br>To get:<br>';

    ciphertext_2 = '';
    for(i of invIP) ciphertext_2 += concat[i - 1];
    html += formatBinary(ciphertext_2);

    html += '</div>';


    /* Step 25 */
    if(step++ == numSteps) return html;
    html += '<div style="background-color: white; padding: 20px 40px; border-radius: 20px; width: 98.7%; margin-top: 20px;"><br><h3><span class="step" style="padding: 10px 20px; background-color: #EB8151; color: white; border-radius: 20px; font-weight: 500; font-size: 14px;">Step 25:</span> <br><br>Convert back into hexadecimal</h3><br><br>';

    base2 = {
        '0000': '0',
        '0001': '1',
        '0010': '2',
        '0011': '3',
        '0100': '4',
        '0101': '5',
        '0110': '6',
        '0111': '7',
        '1000': '8',
        '1001': '9',
        '1010': 'A',
        '1011': 'B',
        '1100': 'C',
        '1101': 'D',
        '1110': 'E',
        '1111': 'F'
    }

    ciphertext = '';
    let chars = ciphertext_2.match(/.{4}/g);
    for(char of chars) {
        ciphertext += base2[char];
    }
    html += 'M<sub>2</sub> = ' + formatBinary(msg_2) + '<br>';
    html += 'M = ' + formatBinary(msg) + '<br><br>';
    html += 'K<sub>2</sub> = ' + formatBinary(key_2) + '<br>';
    html += 'K = ' + formatBinary(key) + '<br><br>';
    html += 'C<sub>2</sub> = ' + formatBinary(ciphertext_2) + '<br>';
    html += '<b>';
    html += 'C = ' + formatBinary(ciphertext);
    html += '</b>';
    
    document.getElementById("textOutput").innerHTML = "Ciphertext";
    document.getElementById("textOutput1").innerHTML = "Plaintext";
    const ciphertextDOM = document.getElementById('ciphertext');
    const plaintextDOM = document.getElementById('plaintext');
    ciphertextDOM.value = ciphertext;
    plaintextDOM.value = hexToString(ciphertext);
    console.log("🚀 ~ file: script.js:711 ~ encrypt ~ plaintext:", plaintext)
    return html;
}

function hexToString(str) {
    let plaintext = '';
    for (let i = 0; i < str.length; i += 2) {
        const hexValue = str.substr(i, 2);
        const decimalValue = parseInt(hexValue, 16);
        plaintext += String.fromCharCode(decimalValue);
    }
    return plaintext
}



function clear() {
    document.getElementById("key").innerHTML = "";
    document.getElementById("msg").innerHTML = "";
}
html += '</div>';











