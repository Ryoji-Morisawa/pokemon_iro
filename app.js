// https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png

const container = document.querySelector('#container');
const baseURL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';

// ランダムで1体だけ色違いにする
const shinyIndex = Math.floor(Math.random() * 151) + 1;

// 問題文を表示
const questionDiv = document.createElement('div');
questionDiv.textContent = '151匹の中に1匹だけ色違いのポケモンがいます。どの番号でしょう？';
questionDiv.style.margin = '10px 0';

// 「正解を見る」ボタンを作成
const answerButton = document.createElement('button');
answerButton.textContent = '正解を見る';

// 正解（色違いの番号）を表示する要素
const answerDiv = document.createElement('div');
answerDiv.style.margin = '10px 0';

answerButton.addEventListener('click', () => {
    answerDiv.textContent = `色違いのポケモン番号は #${shinyIndex} です`;
});

// 回答入力欄を作成
const answerForm = document.createElement('form');
answerForm.style.margin = '10px 0';

const answerInput = document.createElement('input');
answerInput.type = 'number';
answerInput.placeholder = '色違いの番号を入力';
answerInput.min = 1;
answerInput.max = 151;

const submitButton = document.createElement('button');
submitButton.type = 'submit';
submitButton.textContent = '回答する';

const resultDiv = document.createElement('div');
resultDiv.style.margin = '10px 0';

answerForm.appendChild(answerInput);
answerForm.appendChild(submitButton);

// 1. 固定ヘッダー用ラッパーを作成
const fixedHeader = document.createElement('div');
fixedHeader.className = 'fixed-header';

// 2. まとめてラッパーに追加
fixedHeader.appendChild(questionDiv);
fixedHeader.appendChild(answerButton);
fixedHeader.appendChild(answerDiv);
fixedHeader.appendChild(answerForm);
fixedHeader.appendChild(resultDiv);

// 3. containerの前に挿入
document.body.insertBefore(fixedHeader, container);

// 表示モード選択のドロップダウンを作成
const modeSelect = document.createElement('select');
const option1 = document.createElement('option');
option1.value = 'shinyOne';
option1.textContent = '1匹だけ色違い';
const option2 = document.createElement('option');
option2.value = 'normalOne';
option2.textContent = '1匹だけ通常色（難易度高）'; // ←ここを修正
modeSelect.appendChild(option1);
modeSelect.appendChild(option2);
modeSelect.style.margin = '10px 0';
document.body.insertBefore(modeSelect, container);

// 問題リセットボタンを作成
const resetButton = document.createElement('button');
resetButton.textContent = '問題をリセット';
resetButton.style.margin = '10px 0';
document.body.insertBefore(resetButton, container);

// ポケモン表示部分をクリアする関数
function clearPokemon() {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

// ポケモン名を取得して表示する部分を追加
async function getPokemonName(id) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
    const data = await res.json();
    // 日本語名を取得
    const jpName = data.names.find(n => n.language.name === 'ja');
    return jpName ? jpName.name : data.name;
}

// ポケモンを表示する関数
async function showPokemon(mode) {
    clearPokemon();
    let selectedNumber = null; // 選択中の番号を管理
    const randomIndex = Math.floor(Math.random() * 151) + 1;
    for (let i = 1; i <= 151; i++) {
        const pokemonDiv = document.createElement('div');
        pokemonDiv.classList.add('pokemon');
        const label = document.createElement('span');
        // 名前を取得して表示
        getPokemonName(i).then(name => {
            label.innerHTML = `#${i}<br>${name}`; // 数字と名前の間で改行
        });
        const img = document.createElement('img');
        if (mode === 'shinyOne') {
            // 1匹だけ色違い
            if (i === randomIndex) {
                img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${i}.png`;
                img.alt = '色違いポケモン';
            } else {
                img.src = `${baseURL}${i}.png`;
                img.alt = '通常ポケモン';
            }
        } else {
            // 1匹だけ通常色（難易度高いことを明記）
            if (i === randomIndex) {
                img.src = `${baseURL}${i}.png`;
                img.alt = '通常ポケモン';
            } else {
                img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${i}.png`;
                img.alt = '色違いポケモン';
            }
        }
        // 画像クリックで選択・入力欄に反映＆枠付与
        pokemonDiv.addEventListener('click', () => {
            selectedNumber = i;
            answerInput.value = i;
            // 全ての選択枠を外す
            document.querySelectorAll('.pokemon.selected').forEach(el => el.classList.remove('selected'));
            // 今選択したものに枠をつける
            pokemonDiv.classList.add('selected');
        });
        pokemonDiv.appendChild(img);
        pokemonDiv.appendChild(label);
        container.appendChild(pokemonDiv);
    }
    // 問題文・正解番号を更新
    if (mode === 'shinyOne') {
        questionDiv.textContent = '151匹の中に1匹だけ色違いのポケモンがいます。どの番号でしょう？';
        answerButton.onclick = async () => {
            const name = await getPokemonName(randomIndex);
            // 通常色と色違いの画像URL（サイズを128pxに変更）
            const normalImg = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${randomIndex}.png" alt="通常色" style="width:128px;height:128px;">`;
            const shinyImg = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${randomIndex}.png" alt="色違い" style="width:128px;height:128px;">`;
            answerDiv.innerHTML = `
                正解は #${randomIndex} ${name} です<br>
                <span>通常色</span>${normalImg}
                <span style="margin-left:16px;">色違い</span>${shinyImg}
            `;
        };
        answerForm.onsubmit = async (e) => {
            e.preventDefault();
            if (Number(answerInput.value) === randomIndex) {
                resultDiv.textContent = '正解！すごい！';
            } else {
                const name = await getPokemonName(randomIndex);
                resultDiv.textContent = `残念、不正解です。正解は #${randomIndex} ${name} です。`;
            }
        };
    } else {
        questionDiv.textContent = '151匹の中に1匹だけ通常色のポケモンがいます（このモードは難易度が高いです）。どの番号でしょう？';
        answerButton.onclick = async () => {
            const name = await getPokemonName(randomIndex);
            answerDiv.textContent = `通常色のポケモン番号は #${randomIndex} ${name} です`;
        };
        answerForm.onsubmit = async (e) => {
            e.preventDefault();
            if (Number(answerInput.value) === randomIndex) {
                resultDiv.textContent = '正解！すごい！';
            } else {
                const name = await getPokemonName(randomIndex);
                resultDiv.textContent = `残念、不正解です。正解は #${randomIndex} ${name} です。`;
            }
        };
    }
}

// 初期表示
showPokemon('shinyOne');

// モード切り替え時
modeSelect.addEventListener('change', () => {
    showPokemon(modeSelect.value);
});

// リセットボタンの処理
resetButton.addEventListener('click', () => {
    showPokemon(modeSelect.value);
    answerDiv.textContent = '';
    resultDiv.textContent = '';
    answerInput.value = '';
});

