function calc(mon, dex, buff) {
    const ratio = 1 - buff / 100;
    let result = [];
    let cnt = mon.spd_atk - .75 * dex, i;
    for (i = 0; i <= 50 && cnt * ratio > mon.animation; ++i) {
        result.push({
            'equip': i,
            'atkspd': cnt * ratio
        });
        cnt -= 16;
    }
    if (cnt * ratio <= mon.animation) {
        result.push({
            'equip': i + '+',
            'atkspd': mon.animation
        });
    }
    return result;
}
