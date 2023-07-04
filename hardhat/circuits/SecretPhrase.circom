pragma circom 2.1.2;

include "./secp256k1/mul.circom";
include "./address/address.circom";
include "../node_modules/circomlib/circuits/bitify.circom";

template VerifySecretPhrase () {
    var bits = 256;
    signal input s;
    signal input Tx; // T = r^-1 * R
    signal input Ty; 
    signal input Ux; // U = -(m * r^-1 * G)
    signal input Uy;
    signal output addr;

    // sMultT = s * T
    component sMultT = Secp256k1Mul();
    sMultT.scalar <== s;
    sMultT.xP <== Tx;
    sMultT.yP <== Ty;

    // pubKey = sMultT + U 
    component pubKey = Secp256k1AddComplete();
    pubKey.xP <== sMultT.outX;
    pubKey.yP <== sMultT.outY;
    pubKey.xQ <== Ux;
    pubKey.yQ <== Uy;


    component pubKeyXBits = Num2Bits(256);
    pubKeyXBits.in <== pubKey.outX;

    component pubKeyYBits = Num2Bits(256);
    pubKeyYBits.in <== pubKey.outY;

    component pubToAddr = PubkeyToAddress();

    for (var i = 0; i < 256; i++) {
        pubToAddr.pubkeyBits[i] <== pubKeyYBits.out[i];
        pubToAddr.pubkeyBits[i + 256] <== pubKeyXBits.out[i];
    }

    addr <== pubToAddr.address;
    
}

component main = VerifySecretPhrase();