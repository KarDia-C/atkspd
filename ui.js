var info = {};

function update() {
    updateBuffList($('#mon').val());
    let result = ($('#mon').val() || []) && calc(info[$('#mon').val()], $('#dex').val() >> 0, ($('#buff').val() == 'custom' ? $('#customBuff').val() : $('#buff').val()) >> 0);
    for (let i of result) {
        i.atkspd = (1000 / i.atkspd).toFixed(2);
    }
    $("#result").bootstrapTable('refreshOptions', {data: result});
    $(window).resize();
}

function updateBuffList(type) {
    $buff = $('#buff');
    $buff.find('option:not(.general)').attr('disabled', 'disabled');
    if (type) {
        $buff.find(`option.${type}`).removeAttr('disabled');
    }
    if ($buff.find('option:selected').attr('disabled')) {
        $buff.val(0);
    }
    $buff.selectpicker('refresh');
}

function updateTableSize() {
    $('#result').bootstrapTable('resetView', {height: window.innerHeight - $('#result').offset().top - 54});
}

$(() => {
    updateBuffList();
    $(window).resize(updateTableSize).resize();
    $.fn.bootstrapTable.defaults.formatNoMatches = () => '<span class="text-secondary">请选择一个魔物</span>';

    if (!Pinyin.isSupported()) {
        if (!localStorage.shownPYissue) {
            localStorage.shownPYissue = true;
            $("#PYissue").modal("show");
        }
    }

    $.get('moninfo.json', data => {
        data.sort((a, b) => {
            return a.type % 1000000 - b.type % 1000000;
        });
        let $mons = $('#mon');
        for (let mon of data) {
            info[mon.type] = mon;
            let option = document.createElement('option');
            option.value = mon.type;
            let tokens = mon.tokens.split(' ');
            tokens.push(mon.name);
            let pinyins = [];
            if (Pinyin.isSupported()) {
                for (let token of tokens) {
                    let full = '', first = '';
                    for (let char of Pinyin.parse(token)) {
                        if (char.type == 3) {
                            continue;
                        }
                        full += char.target;
                        first += char.target[0];
                    }
                    pinyins.push(full, first);
                }
            }
            option.setAttribute('data-tokens', tokens.concat(pinyins).join(' '));
            option.setAttribute('data-subtext', '★★★★★'.substr(5 - mon.star));
            option.innerHTML = mon.name;
            $mons.append(option);
        }
        $($mons).selectpicker('refresh');
    });

    $('#buff').change(() => {
        if ($('#buff').val() == 'custom') {
            $('#customBuff').show();
        } else {
            $('#customBuff').hide();
        }
        updateTableSize();
    }).add($('#mon, input')).change(update);
});
