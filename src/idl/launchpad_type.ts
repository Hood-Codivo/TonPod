/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/launchpad.json`.
 */
export type Launchpad = {
  "address": "MdR31uPycMD3fYXsAUKj7T9vpVx5rtSwyJmHwVNNneT",
  "metadata": {
    "name": "launchpad",
    "version": "0.1.0",
    "spec": "0.1.0"
  },
  "instructions": [
    {
      "name": "abortMigration",
      "discriminator": [
        115,
        185,
        103,
        70,
        138,
        202,
        43,
        40
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "config"
        },
        {
          "name": "curve",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "buy",
      "discriminator": [
        102,
        6,
        61,
        18,
        1,
        218,
        235,
        234
      ],
      "accounts": [
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "config"
        },
        {
          "name": "curve",
          "writable": true
        },
        {
          "name": "mint",
          "relations": [
            "curve"
          ]
        },
        {
          "name": "quoteMint",
          "relations": [
            "curve"
          ]
        },
        {
          "name": "buyerQuoteAccount",
          "writable": true
        },
        {
          "name": "buyerTokenAccount",
          "writable": true
        },
        {
          "name": "feeRecipientQuoteAccount",
          "writable": true
        },
        {
          "name": "tokenVault",
          "writable": true,
          "relations": [
            "curve"
          ]
        },
        {
          "name": "quoteVault",
          "writable": true,
          "relations": [
            "curve"
          ]
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "quoteAmountIn",
          "type": "u64"
        },
        {
          "name": "minTokenOut",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createLaunch",
      "discriminator": [
        239,
        223,
        255,
        134,
        39,
        121,
        127,
        62
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "config"
        },
        {
          "name": "curve",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "mint"
        },
        {
          "name": "quoteMint"
        },
        {
          "name": "creatorTokenAccount",
          "writable": true
        },
        {
          "name": "tokenVault",
          "writable": true,
          "signer": true
        },
        {
          "name": "quoteVault",
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
          "name": "realTokenReserves",
          "type": "u64"
        },
        {
          "name": "virtualTokenReserves",
          "type": "u128"
        },
        {
          "name": "virtualQuoteReserves",
          "type": "u128"
        },
        {
          "name": "totalSupply",
          "type": "u64"
        }
      ]
    },
    {
      "name": "finalizeMigration",
      "discriminator": [
        34,
        232,
        228,
        252,
        159,
        14,
        96,
        203
      ],
      "accounts": [
        {
          "name": "migrationPayer",
          "writable": true,
          "signer": true
        },
        {
          "name": "curve",
          "writable": true
        },
        {
          "name": "tokenVault",
          "writable": true,
          "relations": [
            "curve"
          ]
        },
        {
          "name": "quoteVault",
          "writable": true,
          "relations": [
            "curve"
          ]
        },
        {
          "name": "ammPool",
          "writable": true
        },
        {
          "name": "ammVaultA",
          "writable": true
        },
        {
          "name": "ammVaultB",
          "writable": true
        },
        {
          "name": "ammLpMint",
          "writable": true
        },
        {
          "name": "lpDestination",
          "writable": true,
          "signer": true
        },
        {
          "name": "ammProgram",
          "address": "43DnDGUdYZSvcCWH2Gdbof6FKTefRwRFJDqUcYH2hDY6"
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
      "args": []
    },
    {
      "name": "initializeGlobalConfig",
      "discriminator": [
        113,
        216,
        122,
        131,
        225,
        209,
        22,
        55
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
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
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
          "name": "platformFeeBps",
          "type": "u16"
        },
        {
          "name": "migrationFeeBps",
          "type": "u16"
        },
        {
          "name": "migrationMarketCap",
          "type": "u128"
        }
      ]
    },
    {
      "name": "migrateToAmm",
      "discriminator": [
        207,
        82,
        192,
        145,
        254,
        207,
        145,
        223
      ],
      "accounts": [
        {
          "name": "migrationPayer",
          "writable": true,
          "signer": true
        },
        {
          "name": "config"
        },
        {
          "name": "curve",
          "writable": true
        },
        {
          "name": "mint",
          "relations": [
            "curve"
          ]
        },
        {
          "name": "quoteMint",
          "relations": [
            "curve"
          ]
        },
        {
          "name": "ammConfig",
          "writable": true
        },
        {
          "name": "ammPool",
          "writable": true
        },
        {
          "name": "ammVaultA",
          "writable": true,
          "signer": true
        },
        {
          "name": "ammVaultB",
          "writable": true,
          "signer": true
        },
        {
          "name": "ammLpMint",
          "writable": true,
          "signer": true
        },
        {
          "name": "ammProgram",
          "address": "43DnDGUdYZSvcCWH2Gdbof6FKTefRwRFJDqUcYH2hDY6"
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
      "name": "pauseLaunch",
      "discriminator": [
        60,
        78,
        254,
        238,
        248,
        212,
        42,
        33
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "config"
        },
        {
          "name": "curve",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "paused",
          "type": "bool"
        }
      ]
    },
    {
      "name": "sell",
      "discriminator": [
        51,
        230,
        133,
        164,
        1,
        127,
        131,
        173
      ],
      "accounts": [
        {
          "name": "seller",
          "writable": true,
          "signer": true
        },
        {
          "name": "config"
        },
        {
          "name": "curve",
          "writable": true
        },
        {
          "name": "mint",
          "relations": [
            "curve"
          ]
        },
        {
          "name": "quoteMint",
          "relations": [
            "curve"
          ]
        },
        {
          "name": "sellerTokenAccount",
          "writable": true
        },
        {
          "name": "sellerQuoteAccount",
          "writable": true
        },
        {
          "name": "feeRecipientQuoteAccount",
          "writable": true
        },
        {
          "name": "tokenVault",
          "writable": true,
          "relations": [
            "curve"
          ]
        },
        {
          "name": "quoteVault",
          "writable": true,
          "relations": [
            "curve"
          ]
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "tokenAmountIn",
          "type": "u64"
        },
        {
          "name": "minQuoteOut",
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
      "name": "bondingCurve",
      "discriminator": [
        23,
        183,
        248,
        55,
        96,
        216,
        172,
        96
      ]
    },
    {
      "name": "globalConfig",
      "discriminator": [
        149,
        8,
        156,
        202,
        160,
        252,
        176,
        217
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
      "name": "launchpadPaused",
      "msg": "The launchpad is paused"
    },
    {
      "code": 6001,
      "name": "alreadyMigrated",
      "msg": "The bonding curve is already migrated"
    },
    {
      "code": 6002,
      "name": "migrationNotReady",
      "msg": "The bonding curve is not ready to migrate"
    },
    {
      "code": 6003,
      "name": "migrationInProgress",
      "msg": "The bonding curve is currently migrating"
    },
    {
      "code": 6004,
      "name": "invalidFee",
      "msg": "Invalid fee basis points"
    },
    {
      "code": 6005,
      "name": "mathOverflow",
      "msg": "Math overflow or underflow"
    },
    {
      "code": 6006,
      "name": "slippageExceeded",
      "msg": "Insufficient output amount"
    },
    {
      "code": 6007,
      "name": "insufficientReserves",
      "msg": "Insufficient reserves"
    },
    {
      "code": 6008,
      "name": "unauthorized",
      "msg": "Only the program's upgrade authority can perform this action"
    },
    {
      "code": 6009,
      "name": "invalidFeeRecipient",
      "msg": "Fee recipient token account does not belong to the configured fee recipient"
    },
    {
      "code": 6010,
      "name": "invalidVirtualReserves",
      "msg": "Virtual reserves must be greater than zero"
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
      "name": "bondingCurve",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "quoteMint",
            "type": "pubkey"
          },
          {
            "name": "tokenVault",
            "type": "pubkey"
          },
          {
            "name": "quoteVault",
            "type": "pubkey"
          },
          {
            "name": "realTokenReserves",
            "type": "u64"
          },
          {
            "name": "realQuoteReserves",
            "type": "u64"
          },
          {
            "name": "virtualTokenReserves",
            "type": "u128"
          },
          {
            "name": "virtualQuoteReserves",
            "type": "u128"
          },
          {
            "name": "totalSupply",
            "type": "u64"
          },
          {
            "name": "tokensSold",
            "type": "u64"
          },
          {
            "name": "migrated",
            "type": "bool"
          },
          {
            "name": "migrating",
            "type": "bool"
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
      "name": "globalConfig",
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
            "name": "platformFeeBps",
            "type": "u16"
          },
          {
            "name": "migrationFeeBps",
            "type": "u16"
          },
          {
            "name": "migrationMarketCap",
            "type": "u128"
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
