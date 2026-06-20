/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/ammverse.json`.
 */
export type Ammverse = {
  "address": "43DnDGUdYZSvcCWH2Gdbof6FKTefRwRFJDqUcYH2hDY6",
  "metadata": {
    "name": "ammverse",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addLiquidity",
      "discriminator": [
        181,
        157,
        89,
        67,
        143,
        182,
        52,
        72
      ],
      "accounts": [
        {
          "name": "depositor",
          "writable": true,
          "signer": true
        },
        {
          "name": "pool",
          "writable": true
        },
        {
          "name": "depositorTokenA",
          "writable": true
        },
        {
          "name": "depositorTokenB",
          "writable": true
        },
        {
          "name": "depositorLp",
          "writable": true
        },
        {
          "name": "vaultA",
          "writable": true,
          "relations": [
            "pool"
          ]
        },
        {
          "name": "vaultB",
          "writable": true,
          "relations": [
            "pool"
          ]
        },
        {
          "name": "lpMint",
          "writable": true,
          "relations": [
            "pool"
          ]
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "amountADesired",
          "type": "u64"
        },
        {
          "name": "amountBDesired",
          "type": "u64"
        },
        {
          "name": "amountAMin",
          "type": "u64"
        },
        {
          "name": "amountBMin",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createPool",
      "discriminator": [
        233,
        146,
        209,
        142,
        207,
        104,
        64,
        188
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "config"
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "mintA"
              },
              {
                "kind": "account",
                "path": "mintB"
              }
            ]
          }
        },
        {
          "name": "mintA"
        },
        {
          "name": "mintB"
        },
        {
          "name": "vaultA",
          "writable": true,
          "signer": true
        },
        {
          "name": "vaultB",
          "writable": true,
          "signer": true
        },
        {
          "name": "lpMint",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "tradeFeeBps",
          "type": "u16"
        }
      ]
    },
    {
      "name": "initializeAmmConfig",
      "discriminator": [
        42,
        76,
        41,
        109,
        119,
        104,
        34,
        99
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "feeRecipient"
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  109,
                  109,
                  45,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "tradeFeeBps",
          "type": "u16"
        },
        {
          "name": "protocolFeeBps",
          "type": "u16"
        }
      ]
    },
    {
      "name": "initializePoolLiquidity",
      "discriminator": [
        241,
        91,
        102,
        213,
        134,
        51,
        76,
        140
      ],
      "accounts": [
        {
          "name": "depositor",
          "writable": true,
          "signer": true
        },
        {
          "name": "pool",
          "writable": true
        },
        {
          "name": "depositorTokenA",
          "writable": true
        },
        {
          "name": "depositorTokenB",
          "writable": true
        },
        {
          "name": "depositorLp",
          "writable": true
        },
        {
          "name": "vaultA",
          "writable": true,
          "relations": [
            "pool"
          ]
        },
        {
          "name": "vaultB",
          "writable": true,
          "relations": [
            "pool"
          ]
        },
        {
          "name": "lpMint",
          "writable": true,
          "relations": [
            "pool"
          ]
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "amountA",
          "type": "u64"
        },
        {
          "name": "amountB",
          "type": "u64"
        },
        {
          "name": "minimumLpOut",
          "type": "u64"
        }
      ]
    },
    {
      "name": "removeLiquidity",
      "discriminator": [
        80,
        85,
        209,
        72,
        24,
        206,
        177,
        108
      ],
      "accounts": [
        {
          "name": "depositor",
          "writable": true,
          "signer": true
        },
        {
          "name": "pool",
          "writable": true
        },
        {
          "name": "depositorTokenA",
          "writable": true
        },
        {
          "name": "depositorTokenB",
          "writable": true
        },
        {
          "name": "depositorLp",
          "writable": true
        },
        {
          "name": "vaultA",
          "writable": true,
          "relations": [
            "pool"
          ]
        },
        {
          "name": "vaultB",
          "writable": true,
          "relations": [
            "pool"
          ]
        },
        {
          "name": "lpMint",
          "writable": true,
          "relations": [
            "pool"
          ]
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "lpAmount",
          "type": "u64"
        },
        {
          "name": "amountAMin",
          "type": "u64"
        },
        {
          "name": "amountBMin",
          "type": "u64"
        }
      ]
    },
    {
      "name": "swapExactIn",
      "discriminator": [
        104,
        104,
        131,
        86,
        161,
        189,
        180,
        216
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "pool",
          "writable": true
        },
        {
          "name": "userInput",
          "writable": true
        },
        {
          "name": "userOutput",
          "writable": true
        },
        {
          "name": "vaultA",
          "writable": true,
          "relations": [
            "pool"
          ]
        },
        {
          "name": "vaultB",
          "writable": true,
          "relations": [
            "pool"
          ]
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "amountIn",
          "type": "u64"
        },
        {
          "name": "minimumAmountOut",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "ammConfig",
      "discriminator": [
        218,
        244,
        33,
        104,
        203,
        203,
        43,
        111
      ]
    },
    {
      "name": "pool",
      "discriminator": [
        241,
        154,
        109,
        4,
        17,
        177,
        109,
        188
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidFee",
      "msg": "Fee vaule is invalid"
    },
    {
      "code": 6001,
      "name": "ammPaused",
      "msg": "AMM is paused"
    },
    {
      "code": 6002,
      "name": "invalidLiquidity",
      "msg": "Invalid liquidity amount"
    },
    {
      "code": 6003,
      "name": "slippageExceeded",
      "msg": "Sliprage tolerance exceeded"
    },
    {
      "code": 6004,
      "name": "mathOverflow",
      "msg": "Math overflow"
    }
  ],
  "types": [
    {
      "name": "ammConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "feeRecipient",
            "type": "pubkey"
          },
          {
            "name": "tradeFeeBps",
            "type": "u16"
          },
          {
            "name": "protocolFeeBps",
            "type": "u16"
          },
          {
            "name": "paused",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "pool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mintA",
            "type": "pubkey"
          },
          {
            "name": "mintB",
            "type": "pubkey"
          },
          {
            "name": "vaultA",
            "type": "pubkey"
          },
          {
            "name": "vaultB",
            "type": "pubkey"
          },
          {
            "name": "lpMint",
            "type": "pubkey"
          },
          {
            "name": "reserveA",
            "type": "u64"
          },
          {
            "name": "reserveB",
            "type": "u64"
          },
          {
            "name": "tradeFeeBps",
            "type": "u16"
          },
          {
            "name": "protocolFeeBps",
            "type": "u16"
          },
          {
            "name": "locked",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
