const randomFloatBetween0and1 = () => Math.random();

const randomIntegerInInterval = ({min, max}, random = randomFloatBetween0and1) => 
    Math.floor(random() * (max-min)) + min

module.exports = randomIntegerInInterval;