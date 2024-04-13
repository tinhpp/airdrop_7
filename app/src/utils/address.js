export const formatAddress = (address, start = 3, end = 3) =>
  `${address?.substring(0, start)}...${address?.substring(address.length - end, address.length)}`;
