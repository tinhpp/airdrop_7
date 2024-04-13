const { expect } = require("chai");
const { parseEther } = require("ethers/lib/utils");

const ItemStatus = {
    OPENING: 0,
    SOLD: 1,
    CLOSED: 2
}

describe("NFTMarketplace", function () {

    let nft;
    let marketplace
    let liquidateNFTPool;
    let deployer;
    let addr1;
    let addr2;
    let addrs;
    let feePercent = 10;

    beforeEach(async function () {
        // Get the ContractFactories and Signers here.
        const NFT = await ethers.getContractFactory("MockERC721");
        const WXCR = await ethers.getContractFactory("WXCR");
        const LiquidateNFTPool = await ethers.getContractFactory("LiquidateNFTPool");
        const Marketplace = await ethers.getContractFactory("Marketplace");
        [deployer, addr1, addr2, loan, ...addrs] = await ethers.getSigners();

        // To deploy our contracts
        nft = await NFT.deploy();
        wXCR = await WXCR.deploy();
        liquidateNFTPool = await LiquidateNFTPool.deploy(deployer.address, loan.address);
        marketplace = await Marketplace.deploy(wXCR.address, feePercent);

        await liquidateNFTPool.setMarketplace(marketplace.address);
        await marketplace.setLiquidateNFTPool(liquidateNFTPool.address);
    });

    describe("Deployment", function () {

        it("Should track name and symbol of the nft collection", async function () {
            // This test expects the owner variable stored in the contract to be equal
            // to our Signer's owner.
            const nftName = "MockERC721"
            const nftSymbol = "ERC721"
            expect(await nft.name()).to.equal(nftName);
            expect(await nft.symbol()).to.equal(nftSymbol);
        });

        it("Should track feeAccount and feePercent of the marketplace", async function () {
            expect(await marketplace.feeAccount()).to.equal(deployer.address);
            expect(await marketplace.feePercent()).to.equal(feePercent);
        });
    });

    describe("Minting NFTs", function () {

        it("Should track each minted NFT", async function () {
            // addr1 mints an nft
            await nft.connect(addr1).mint(addr1.address)
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
            // addr2 mints an nft
            await nft.connect(addr2).mint(addr2.address)
            expect(await nft.balanceOf(addr2.address)).to.equal(1);
        });
    })

    describe("Purchasing marketplace items in cart", function () {
        let price = 1
        const itemIds = [1, 2, 3, 4, 5]
        const payable = parseEther(price.toString()).mul(itemIds.length)
        const fee = marketFee(payable, feePercent);
        beforeEach(async function () {
            // addr1 mints an nft
            await nft.connect(addr1).mint(addr1.address)
            await nft.connect(addr1).mint(addr1.address)
            await nft.connect(addr1).mint(addr1.address)
            await nft.connect(addr1).mint(addr1.address)
            await nft.connect(addr1).mint(addr1.address)
            // addr1 approves marketplace to spend tokens
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true)
            // addr1 makes their nft a marketplace item.
            await Promise.all(itemIds.map(async (id) => {
                await marketplace.connect(addr1).makeItem(nft.address, id, parseEther(price.toString()))
            }))
        })
        it("Should update item as sold, pay seller, transfer NFT to buyer, charge fees and emit a Bought event", async function () {
            const sellerInitialEthBal = await addr1.getBalance()
            const feeAccountInitialEthBal = await deployer.getBalance()

            // addr 2 purchases item.
            await marketplace.connect(addr2).purchaseItems(itemIds, { value: payable.add(1) })

            const sellerFinalEthBal = await addr1.getBalance()
            const feeAccountFinalEthBal = await deployer.getBalance()
            // Item should be marked as sold
            expect((await marketplace.items(1)).status).to.equal(ItemStatus.SOLD)
            expect((await marketplace.items(2)).status).to.equal(ItemStatus.SOLD)
            expect((await marketplace.items(3)).status).to.equal(ItemStatus.SOLD)
            expect((await marketplace.items(4)).status).to.equal(ItemStatus.SOLD)
            expect((await marketplace.items(5)).status).to.equal(ItemStatus.SOLD)

            // Seller should receive payment for the price of the NFT sold.
            expect(sellerFinalEthBal).to.equal(sellerInitialEthBal.add(payable.sub(fee)))
            // feeAccount should receive fee
            expect(feeAccountFinalEthBal).to.equal(feeAccountInitialEthBal.add(fee).add(1))
            // The buyer should now own the nft
            expect(await nft.ownerOf(1)).to.equal(addr2.address);
            expect(await nft.ownerOf(2)).to.equal(addr2.address);
            expect(await nft.ownerOf(3)).to.equal(addr2.address);
            expect(await nft.ownerOf(4)).to.equal(addr2.address);
            expect(await nft.ownerOf(5)).to.equal(addr2.address);
        })

        it("Should fail for invalid item ids, sold items and when not enough ether is paid", async function () {
            // fails for invalid item ids
            await expect(
                marketplace.connect(addr2).purchaseItems([6], { value: parseEther(price.toString()) })
            ).to.be.revertedWith("item doesn't exist");
            await expect(
                marketplace.connect(addr2).purchaseItems([0], { value: parseEther(price.toString()) })
            ).to.be.revertedWith("item doesn't exist");
            // Fails when not enough ether is paid with the transaction. 
            await expect(
                marketplace.connect(addr2).purchaseItems(itemIds, { value: payable.sub(1) })
            ).to.be.revertedWith("not enough ether to paid");
            // addr2 purchases item 1
            await marketplace.connect(addr2).purchaseItems(itemIds, { value: payable })
            // addr3 tries purchasing item 1 after its been sold 
            const addr3 = addrs[0]
            await expect(
                marketplace.connect(addr3).purchaseItems(itemIds, { value: payable })
            ).to.be.revertedWith("item already sold");
        });
    })

    describe("Purchasing items from seller and loan", () => {
        let price = 1
        const itemIds = [1, 2, 3, 4]
        beforeEach(async function () {
            // addr1 mints an nft
            await nft.connect(addr1).mint(addr1.address)
            await nft.connect(addr1).mint(addr1.address)
            // loan mints an nft
            await nft.connect(loan).mint(loan.address)
            await nft.connect(loan).mint(loan.address)
            // addr1 approves marketplace to spend tokens
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true)
            // loan approves liquidateNFTPool to spend tokens
            await nft.connect(loan).setApprovalForAll(liquidateNFTPool.address, true)
            // addr1 makes their nft a marketplace item.
            await marketplace.connect(addr1).makeItem(nft.address, 1, parseEther(price.toString()))
            await marketplace.connect(addr1).makeItem(nft.address, 2, parseEther(price.toString()))
            // loan makes their nft a liquidateNFTPool item.
            await liquidateNFTPool.connect(loan).liquidateNFT(ethers.utils.formatBytes32String("1"), nft.address, 3, wXCR.address, parseEther(price.toString()))
            await liquidateNFTPool.connect(loan).liquidateNFT(ethers.utils.formatBytes32String("2"), nft.address, 4, wXCR.address, parseEther(price.toString()))
        })

        /**
         * Seller: pool, addr1
         * addr1 => Items [1, 2] | 1 XCR/item | marketFee is 10%
         * pool  => Items [3, 4] | 1 XCR/item |
         * Calculate:
         * addr2 => purchaseItems([1, 2, 3, 4]) => | addr2:     -4 XCR                         | => transfer nft 1 to addr2 
         *                                         | marketFee: (2 XCR * 10) / 100 = +0.2 XCR  |    transfer nft 2 to addr2
         *                                         | addr1:      2 XCR - 0.2 XCR   = +1.8 XCR  |    transfer nft 3 to addr2
         *                                         | loan:      +2 wXCR                        |    transfer nft 4 to addr2
         */
        it("addr2: -4XCR, marketplace: +0.2XCR, add1: +1.8XCR, loan: +2wXCR", async () => {
            expect(await wXCR.balanceOf(loan.address)).to.eq(0);

            await expect(() => marketplace.connect(addr2).purchaseItems(itemIds, { value: parseEther('4') }))
                .to
                .changeEtherBalances([addr1, addr2, deployer, loan], [parseEther("1.8"), parseEther("-4"), parseEther("0.2"), 0])

            expect(await wXCR.balanceOf(loan.address)).to.eq(parseEther("2"));

            expect(await nft.ownerOf(1)).to.equal(addr2.address);
            expect(await nft.ownerOf(2)).to.equal(addr2.address);
            expect(await nft.ownerOf(3)).to.equal(addr2.address);
            expect(await nft.ownerOf(4)).to.equal(addr2.address);
        })
    })
})

function marketFee(itemPrice, marketPercent) {
    return itemPrice.mul(marketPercent).div(100);
}