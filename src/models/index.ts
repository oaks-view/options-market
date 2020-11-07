class Option {
  constructor(
    public address: string = null,
    public oTokenExchangeRateValue: string = null,
    public oTokenExchangeRateExp: string = null,
    public underlying: string = null,
    public strike: string = null,
    public strikePriceValue: string = null,
    public expiry: string = null
  ) {}

  public fromDto(dto: any) {
    this.address = dto.address;
    this.oTokenExchangeRateValue = dto.oTokenExchangeRateValue;
    this.oTokenExchangeRateExp = dto.oTokenExchangeRateExp;
    this.underlying = dto.underlying;
    this.strike = dto.strike;
    this.strikePriceValue = dto.strikePriceValue;
    this.expiry = dto.expiry;

    return this;
  }

  get expirationDate() {
    return new Date(+this.expiry * 1000);
  }
}

export { Option };
