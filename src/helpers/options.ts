interface ComputeMaxLossAndGainsParams {
  /** number of units of options being bought or sold */
  positionSize: number;
  strikePrice: number;
  /** premium per unit of option */
  price: number;
  /** `true` if its a put option `false` if its a call option`true` if its a put option `false` if its a call option */
  isBuyPosition: boolean;
}

interface ComputeMaxLossAndGainsReturnVals {
  maxLoss: number;
  maxGain: number;
}

export const computeMaxLossAndGain = ({
  positionSize = 0,
  strikePrice = 0,
  price = 0,
  isBuyPosition = false,
}: ComputeMaxLossAndGainsParams): ComputeMaxLossAndGainsReturnVals => {
  const totalPremium = price * positionSize;

  const assetTotal = strikePrice * positionSize;

  const maxLoss = +(isBuyPosition
    ? totalPremium
    : strikePrice * positionSize
  ).toFixed(2);
  const maxGain = +(isBuyPosition
    ? assetTotal - totalPremium
    : totalPremium
  ).toFixed(2);

  return {
    maxLoss,
    maxGain,
  };
};
