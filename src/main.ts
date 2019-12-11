declare var window: any;

function main(param: g.GameMainParameterObject): void {
    const scene = new g.Scene({
        game: g.game,
        assetIds: ["button"]
    });

    let scoreTable: { [key: string]: number } = {};


    scene.loaded.add(() => {
        const background = new g.FilledRect({
            scene,
            cssColor: "rgba(255,200,200,0.5)",
            width: g.game.width,
            height: g.game.height
        });
        scene.append(background);

        const font = new g.DynamicFont({game: g.game, fontFamily: g.FontFamily.Serif, fontColor: "black", size: 32});
        // スコア表示TOP5用のラベル
        const rankingScoreLabels = initializeRankingLabels(scene, font);

        const darkButton = new g.Sprite({
            scene: scene,
            src: scene.assets["button"],
            touchable: true
        });
        scene.append(darkButton);

        darkButton.pointDown.add((e) => {
            // 押した人を取得
            const winnerId = e.player.id.slice(-5);
            // scoreを加算する
            if (scoreTable[winnerId] == null) {
                scoreTable[winnerId] = 1;
            } else {
                scoreTable[winnerId] += 1;
            }

            // ラベル更新
            updateRankingLabels(scoreTable, rankingScoreLabels);
        });

    });
    g.game.pushScene(scene);
}


function initializeRankingLabels(scene: g.Scene, font: g.DynamicFont): g.Label[] {
    return [0, 1, 2, 3, 4].map((num) => {
        const label = new g.Label({scene, font, text: "", fontSize: 32, width: 300});
        label.x = g.game.width - 300;
        label.y = 32 * num;
        scene.append(label);

        return label;
    });
}

function updateRankingLabels(scoreTable: { [key: string]: number }, labels: g.Label[]) {
    Object.keys(scoreTable).map((id: string) => {
        return {score: scoreTable[id], id: id};
    }).sort((a, b) => {
        return b.score - a.score;
    }).slice(0, 5).forEach((score, index) => {
        labels[index].text = `${score.id}さん: ${score.score}pt.`;
        labels[index].invalidate();
    });
}

export = main;
