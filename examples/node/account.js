/*!
 * @dispatchlabs/disnode-sdk <https://github.com/dispatchlabs/disnode_sdk>
 *
 * Copyright © 2018, [Dispatch Labs](http://dispatchlabs.io).
 * Released under the LGPL v3 License.
 */

'use strict'

const DisNodeSDK = require('./../../');

module.exports = () => {
  return new Promise((resolve, reject) => {
    console.log('--- ACCOUNT EXAMPLES ---\n');

    // Account is a constructor with no required inputs
    const temp = new DisNodeSDK.Account();
    // It can also accept any account fields; the most prominant being the privateKey
    const test = new DisNodeSDK.Account({name: 'NodeSDKTest', privateKey: 'a544cca72d88a49ec3afadc4a358125a138ad83b6fce72c1067b5773d8ae688f' });

    // Use account.init() to generate a private key
    temp.init();
    // Models output clean strings in logs and JSON.stringify
    console.log('Temp account:\n' + temp + '\n');

    // Account objects can send tokens to other accounts directly; returning the resulting Transaciton
    let tx = test.sendTokens(temp, 5);
    console.log('New "sendTokens" transaction:\n' + tx + '\n');

    // Calling "send" on the Transaction will return the original Promise (not re-send the tx)
    tx.send()
      .then(
        (ok) => {
          // Use 'whenStatusEquals' (returns a Promise) to wait for the transaction to finish
          tx.whenStatusEquals('Ok')
            .then(
              (result) => {
                console.log('Transaction result:\n' + JSON.stringify(result) + '\n');

                // Reset
                temp.sendTokens(test, 5).send()
                  .then(() => {
                    resolve();
                  })
                  .catch((e) => {
                    resolve();
                  });

              }, (err) => {
                console.log('Transaction status error:\n' + JSON.stringify(err) + '\n');
              }
            );
        },
        (err) => {
          console.log('Transaction result error:\n' + JSON.stringify(err) + '\n');
        }
      );
  });
};
