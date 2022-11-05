
const CoinAPI = async () => {
    let response = await fetch( "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false");

    if (response.ok) {
        return await response.json()
    }else{
        return {};
    }

};

export default CoinAPI;
