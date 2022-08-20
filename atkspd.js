function toFrame(ms) {
    return Math.floor(ms * .06) + 1; // ms / (1000 / 60)
}

function calc_(mon, dex, buff) {
    const ratio = 1 - buff / 100;
    let result = [];
    let cnt = mon.spd_atk - .75 * dex, i;
    for (i = 0; i <= 60; ++i) {
        let frames = toFrame(cnt * ratio);
        if (frames <= mon.animation) break;
        if (result[frames]) result[frames][1] = i;
        else result[frames] = [i, i];
        cnt -= 16;
    }
    if (toFrame(cnt * ratio) <= mon.animation) {
        result[mon.animation] = i + '+';
    }
    let rtn = [];
    for (i = result.length - 1; result[i] !== undefined; --i) {
        let equip;
        if (result[i] instanceof Array) {
            if (result[i][0] == result[i][1]) equip = result[i][0];
            else equip = result[i][0] + '-' + result[i][1];
        } else equip = result[i];
        rtn.push({
            equip,
            atkspd: (60 / i).toFixed(2),
        });
    }
    return rtn;
}

function toFreq(ms) {
    return (1000 / ms).toFixed(2);
}

function calc(mon, dex, buff) {
    const ratio = 1 - buff / 100;
    let result = [];
    let cnt = mon.spd_atk - .75 * dex, i;
    let animation = mon.animation / .06;
    for (i = 0; i <= 60 && cnt * ratio > animation; ++i) {
        result.push({
            'equip': i,
            'atkspd': toFreq(cnt * ratio),
        });
        cnt -= 16;
    }
    if (cnt * ratio <= animation) {
        result.push({
            'equip': i + '+',
            'atkspd': toFreq(animation),
        });
    }
    return result;
}
