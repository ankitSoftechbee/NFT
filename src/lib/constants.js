export const constants = {
    CONTRACT_ADDRESS: '0x7F92b3dC5f988EC99B60993AAfD4E3f0efB678C3',
    CONTRACT_ABI: [
        {
            anonymous: false,
            inputs: [
                { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
                { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
                { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'Approval',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                { indexed: true, internalType: 'address', name: 'user', type: 'address' },
                { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
            ],
            name: 'Burn',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                { indexed: true, internalType: 'address', name: 'user', type: 'address' },
                { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
            ],
            name: 'Mint',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
                { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
            ],
            name: 'OwnershipTransferPrepared',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
                { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
            ],
            name: 'OwnershipTransferred',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
                { indexed: true, internalType: 'address', name: 'redeemToEthAccount', type: 'address' },
                { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
            ],
            name: 'Redeem',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                { indexed: true, internalType: 'address', name: 'from', type: 'address' },
                { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'Transfer',
            type: 'event',
        },
        { inputs: [], name: '_Future_OWNER_', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
        { inputs: [], name: '_OWNER_', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
        {
            inputs: [
                { internalType: 'address', name: 'owner', type: 'address' },
                { internalType: 'address', name: 'spender', type: 'address' },
            ],
            name: 'allowance',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                { internalType: 'address', name: 'spender', type: 'address' },
                { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'approve',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
            name: 'balanceOf',
            outputs: [{ internalType: 'uint256', name: 'balance', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
        },
        { inputs: [{ internalType: 'uint256', name: 'value', type: 'uint256' }], name: 'burn', outputs: [], stateMutability: 'nonpayable', type: 'function' },
        { inputs: [], name: 'claimOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
        { inputs: [], name: 'decimals', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
        { inputs: [], name: 'maxSupply', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
        {
            inputs: [
                { internalType: 'address', name: 'user', type: 'address' },
                { internalType: 'uint256', name: 'value', type: 'uint256' },
            ],
            name: 'mint',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        { inputs: [], name: 'name', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
        {
            inputs: [
                { internalType: 'uint256', name: 'value', type: 'uint256' },
                { internalType: 'address', name: 'redeemToEthAccount', type: 'address' },
            ],
            name: 'redeem',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        { inputs: [], name: 'symbol', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
        { inputs: [], name: 'totalSupply', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
        {
            inputs: [
                { internalType: 'address', name: 'to', type: 'address' },
                { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'transfer',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                { internalType: 'address', name: 'from', type: 'address' },
                { internalType: 'address', name: 'to', type: 'address' },
                { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'transferFrom',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        { inputs: [{ internalType: 'address', name: 'futureOwner', type: 'address' }], name: 'transferOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    ],

    USDT_CONTRACT_ADDRESS: '0xf01604870CCFfa555B0dd4a36D60CFDAe7Df6D92',
    USDT_ABI: [
        {
            anonymous: false,
            inputs: [
                { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
                { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
                { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'Approval',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                { indexed: true, internalType: 'address', name: 'user', type: 'address' },
                { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
            ],
            name: 'Burn',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                { indexed: true, internalType: 'address', name: 'user', type: 'address' },
                { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
            ],
            name: 'Mint',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
                { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
            ],
            name: 'OwnershipTransferPrepared',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
                { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
            ],
            name: 'OwnershipTransferred',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
                { indexed: true, internalType: 'address', name: 'redeemToEthAccount', type: 'address' },
                { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
            ],
            name: 'Redeem',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                { indexed: true, internalType: 'address', name: 'from', type: 'address' },
                { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'Transfer',
            type: 'event',
        },
        { inputs: [], name: '_Future_OWNER_', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
        { inputs: [], name: '_OWNER_', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
        {
            inputs: [
                { internalType: 'address', name: 'owner', type: 'address' },
                { internalType: 'address', name: 'spender', type: 'address' },
            ],
            name: 'allowance',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                { internalType: 'address', name: 'spender', type: 'address' },
                { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'approve',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
            name: 'balanceOf',
            outputs: [{ internalType: 'uint256', name: 'balance', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
        },
        { inputs: [{ internalType: 'uint256', name: 'value', type: 'uint256' }], name: 'burn', outputs: [], stateMutability: 'nonpayable', type: 'function' },
        { inputs: [], name: 'claimOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
        { inputs: [], name: 'decimals', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
        { inputs: [], name: 'maxSupply', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
        {
            inputs: [
                { internalType: 'address', name: 'user', type: 'address' },
                { internalType: 'uint256', name: 'value', type: 'uint256' },
            ],
            name: 'mint',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        { inputs: [], name: 'name', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
        {
            inputs: [
                { internalType: 'uint256', name: 'value', type: 'uint256' },
                { internalType: 'address', name: 'redeemToEthAccount', type: 'address' },
            ],
            name: 'redeem',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        { inputs: [], name: 'symbol', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
        { inputs: [], name: 'totalSupply', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
        {
            inputs: [
                { internalType: 'address', name: 'to', type: 'address' },
                { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'transfer',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                { internalType: 'address', name: 'from', type: 'address' },
                { internalType: 'address', name: 'to', type: 'address' },
                { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'transferFrom',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        { inputs: [{ internalType: 'address', name: 'futureOwner', type: 'address' }], name: 'transferOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    ],
};