function toFrame(ms) {
    return Math.floor(ms * .05) + 1; // ms / (1000 / 50)
}

function calc(mon, dex, buff) {
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
            atkspd: (50 / i).toFixed(2),
        });
    }
    return rtn;
}
