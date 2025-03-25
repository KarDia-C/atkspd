var info = {};

function update() {
    updateBuffList($('#mon').val());
    let result = ($('#mon').val() || []) && calc(info[$('#mon').val()], $('#dex').val() >> 0, ($('#buff').val() == 'custom' ? $('#customBuff').val() : $('#buff').val()) >> 0);
    $("#result").bootstrapTable('refreshOptions', {data: result});
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

$(() => {
    updateBuffList();
    let erd = elementResizeDetectorMaker();
    erd.listenTo($('#tableContainer')[0], element => {
        $('#result').bootstrapTable('resetView', {height: element.offsetHeight});
    });
    $.fn.bootstrapTable.defaults.formatNoMatches = () => '<span class="text-secondary">请选择一个魔物</span>';

    if (!Pinyin.isSupported()) {
        if (!localStorage.shownPYissue) {
            localStorage.shownPYissue = true;
            $("#PYissue").modal("show");
        }
    }

    $.get('moninfo.json', data => {
        data.sort((a, b) => {
            if (a.star !== b.star) return a.star - b.star;
            return a.type.localeCompare(b.type);
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
                        if (char.source === '·' || char.source === '・') continue;
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
    }).add($('#mon, input')).change(update);
});
