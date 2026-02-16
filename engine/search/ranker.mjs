"use strict";

export class Ranker {
    constructor(settings, dl, k1, b, avgdl) {
        this.settings = settings;
    }

    initData(k1, b, avgdl) {
        this.k1 = k1;
        this.b = b;
        this.avgdl = avgdl;
    }

    /**
     * Method that evaulates document and generate scoring.
     * Score is based on body, title and anchor weights.
     */
    evaluateDocument(idf, fields, dl) {
        const bodyTitleWeight = fields.bodyWeight || 0;
        const titleWeight = fields.titleWeight || 0;
        const anchorWeight = fields.anchorWeight || 0;

        let score;

        score = this.addToScore(
            bodyTitleWeight,
            score,
            'BODY_TITLE_WEIGHT_MULTIPLIER',
        );

        score = this.addToScore(
            titleWeight,
            score,
            'TITLE_WEIGHT_MULTIPLIER',
        );

        score = this.addToScore(
            anchorWeight,
            score,
            'ANCHOR_WEIGHT_MULTIPLIER',
        );
    }

    addToScore(weight, score, setting) {
        const normal = (tf) =>
            (tf * (this.k1 + 1)) /
            (tf + this.k1 * (1 - this.b + this.b * (this.dl / this.avgdl)));

        if (weight) {
            score += idf * normal(weight) *
                Number(this.settings[setting]);
            return score;
        }
    }
} 