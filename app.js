// https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png

const container = document.querySelector('#container');
const baseURL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';

// --- 上部固定ヘッダーの作成 ---
const fixedHeader = document.createElement('div');
fixedHeader.className = 'fixed-header';

// モード選択
const modeSelect = document.createElement('select');
const option1 = document.createElement('option');
option1.value = 'shinyOne';
option1.textContent = '1匹だけ色違い';
const option2 = document.createElement('option');
option2.value = 'normalOne';
option2.textContent = '1匹だけ通常色（難易度高）';
modeSelect.appendChild(option1);
modeSelect.appendChild(option2);

// 問題文
const questionDiv = document.createElement('div');
questionDiv.style.margin = '10px 0';

// 回答フォーム
const answerForm = document.createElement('form');
answerForm.style.margin = '10px 0';
const answerInput = document.createElement('input');
answerInput.type = 'number';
answerInput.placeholder = '番号を入力';
answerInput.min = 1;
answerInput.max = 151;
const submitButton = document.createElement('button');
submitButton.type = 'submit';
submitButton.textContent = '回答する';
const answerButton = document.createElement('button');
answerButton.type = 'button';
answerButton.textContent = '正解を見る';
const resetButton = document.createElement('button');
resetButton.type = 'button';
resetButton.textContent = '問題をリセット';
answerForm.appendChild(answerInput);
answerForm.appendChild(submitButton);
answerForm.appendChild(answerButton);
answerForm.appendChild(resetButton);

// 正解・結果表示
const answerDiv = document.createElement('div');
answerDiv.style.margin = '10px 0';
const resultDiv = document.createElement('div');
resultDiv.style.margin = '10px 0';

// ヘッダーにまとめて追加
fixedHeader.appendChild(modeSelect);
fixedHeader.appendChild(questionDiv);
fixedHeader.appendChild(answerForm);
fixedHeader.appendChild(answerDiv);
fixedHeader.appendChild(resultDiv);

// containerの前に挿入
document.body.insertBefore(fixedHeader, container);

// --- ポケモン表示 ---
function clearPokemon() {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

function showPokemon(mode) {
    clearPokemon();
    answerDiv.textContent = '';
    resultDiv.textContent = '';
    answerInput.value = '';
    answerForm.style.display = '';

    // 選択状態を管理するための変数
    let selectedNumber = null;

    const randomIndex = Math.floor(Math.random() * 151) + 1;
    for (let i = 1; i <= 151; i++) {
        const pokemonDiv = document.createElement('div');
        pokemonDiv.classList.add('pokemon');
        const label = document.createElement('span');
        // 名前を取得して表示
        getPokemonName(i).then(name => {
            label.innerHTML = `#${i}<br>${name}`;
        });
        const img = document.createElement('img');
        if (mode === 'shinyOne') {
            if (i === randomIndex) {
                img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${i}.png`;
                img.alt = '色違いポケモン';
            } else {
                img.src = `${baseURL}${i}.png`;
                img.alt = '通常ポケモン';
            }
        } else {
            if (i === randomIndex) {
                img.src = `${baseURL}${i}.png`;
                img.alt = '通常ポケモン';
            } else {
                img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${i}.png`;
                img.alt = '色違いポケモン';
            }
        }

        // ここでクリックイベントを追加
        pokemonDiv.addEventListener('click', () => {
            selectedNumber = i;
            answerInput.value = i;
            // すべての選択枠を外す
            document.querySelectorAll('.pokemon.selected').forEach(el => el.classList.remove('selected'));
            // 今選択したものに枠をつける
            pokemonDiv.classList.add('selected');
        });

        pokemonDiv.appendChild(img);
        pokemonDiv.appendChild(label);
        container.appendChild(pokemonDiv);
    }

    // 入力欄の値が変わったときも強調表示を変更
    answerInput.addEventListener('input', () => {
        const val = Number(answerInput.value);
        document.querySelectorAll('.pokemon.selected').forEach(el => el.classList.remove('selected'));
        // 入力値が有効な番号なら強調
        if (val >= 1 && val <= 151) {
            const allPokemon = container.querySelectorAll('.pokemon');
            if (allPokemon[val - 1]) {
                allPokemon[val - 1].classList.add('selected');
            }
        }
    });

    // 問題文・正解ボタン
    if (mode === 'shinyOne') {
        questionDiv.textContent = '151匹の中に1匹だけ色違いのポケモンがいます。どの番号でしょう？';
        answerButton.onclick = async () => {
            // ポケモン名を取得
            const name = await getPokemonName(randomIndex);
            // 通常色と色違いの画像を表示
            const normalImg = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${randomIndex}.png" alt="通常色" style="width:128px;height:128px;">`;
            const shinyImg = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${randomIndex}.png" alt="色違い" style="width:128px;height:128px;">`;
            answerDiv.innerHTML = `
                色違いのポケモン番号は #${randomIndex} ${name} です<br>
                <span>通常色</span>${normalImg}
                <span style="margin-left:16px;">色違い</span>${shinyImg}
            `;
            submitButton.style.display = 'none';
            answerButton.style.display = 'none';
            answerInput.style.display = 'none';
        };
        answerForm.onsubmit = (e) => {
            e.preventDefault();
            if (Number(answerInput.value) === randomIndex) {
                resultDiv.innerHTML = `<span style="color:#fff;background:#43a047;padding:6px 18px;border-radius:8px;font-size:20px;font-weight:bold;display:inline-block;">正解！すごい！🎉</span>`;
            } else {
                resultDiv.innerHTML = `<span style="color:#fff;background:#e53935;padding:6px 18px;border-radius:8px;font-size:20px;font-weight:bold;display:inline-block;">残念、不正解です</span>`;
            }
        };
    } else {
        questionDiv.textContent = '151匹の中に1匹だけ通常色のポケモンがいます（このモードは難易度が高いです）。どの番号でしょう？';
        answerButton.onclick = async () => {
            // ポケモン名を取得
            const name = await getPokemonName(randomIndex);
            // 通常色と色違いの画像を表示
            const normalImg = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${randomIndex}.png" alt="通常色" style="width:128px;height:128px;">`;
            const shinyImg = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${randomIndex}.png" alt="色違い" style="width:128px;height:128px;">`;
            answerDiv.innerHTML = `
                通常色のポケモン番号は #${randomIndex} ${name} です<br>
                <span>通常色</span>${normalImg}
                <span style="margin-left:16px;">色違い</span>${shinyImg}
            `;
            submitButton.style.display = 'none';
            answerButton.style.display = 'none';
            answerInput.style.display = 'none';
        };
        answerForm.onsubmit = (e) => {
            e.preventDefault();
            if (Number(answerInput.value) === randomIndex) {
                resultDiv.innerHTML = `<span style="color:#fff;background:#43a047;padding:6px 18px;border-radius:8px;font-size:20px;font-weight:bold;display:inline-block;">正解！すごい！🎉</span>`;
            } else {
                resultDiv.innerHTML = `<span style="color:#fff;background:#e53935;padding:6px 18px;border-radius:8px;font-size:20px;font-weight:bold;display:inline-block;">残念、不正解です</span>`;
            }
        };
    }
    // リセットボタンの処理
    resetButton.onclick = () => {
        showPokemon(modeSelect.value);
        // フォームの各要素を再表示
        submitButton.style.display = '';
        answerButton.style.display = '';
        answerInput.style.display = '';
    };
}

// ポケモン名を取得して日本語で返す関数
async function getPokemonName(id) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
    const data = await res.json();
    const jpName = data.names.find(n => n.language.name === 'ja');
    return jpName ? jpName.name : data.name;
}

// 初期表示
showPokemon('shinyOne');

// モード切り替え
modeSelect.addEventListener('change', () => {
    showPokemon(modeSelect.value);
});