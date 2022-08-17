// DEPENDENCIES
const express = require("express");
const effects = express.Router();
const authenticateToken = require("../validations/authorization");

const {
    getAllUserEffects,
    getAllAudioEffects,
    getUserAudioEffect,
    createEffect,
    deleteEffect,
    updateEffect,
    hasEffects,
    updateEffectVotes,
} = require("../queries/effects");

// GET ONE EFFECT BY USER AND SPECIFIC AUDIO
effects.get("/", async (req, res) => {
    try {
        const effect = await getUserAudioEffect(req.body);
        res.status(200).json(effect);
    } catch (error) {
        res.status(404).json({ error: error });
    }
});

// GET ALL EFFECTS FOR USER
effects.get("/allmixes/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const allEffects = await getAllUserEffects(id);
        res.status(200).json(allEffects);
    } catch (error) {
        res.status(404).json({ error: error });
    }
});

// GET ALL EFFECTS FOR ALL USERS SPECIFIC AUDIO
effects.get("/allusers/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const allEffects = await getAllAudioEffects(id);
        res.status(200).json(allEffects);
    } catch (error) {
        res.status(404).json({ error: error });
    }
});

// UPDATE AN EFFECT'S VOTES
effects.put("/:id/:votes", async (req, res) => {
    const { id, votes } = req.params;
    try {
        const updatedVotes = await updateEffectVotes(id, votes);
        res.status(200).json(updatedVotes);
    } catch (error) {
        res.status(404).json({ error: error });
    }
});

// UPDATE AN EFFECT
effects.put("/", authenticateToken, async (req, res) => {
    const { effects, audio_id, user_id } = req.body;
    try {
        const updatedEffect = await updateEffect(effects, audio_id, user_id);
        res.status(200).json(updatedEffect);
    } catch (error) {
        res.status(404).json({ error: error });
    }
});

// CREATE AN EFFECT
effects.post("/", authenticateToken, async (req, res) => {
    try {
        const { effects, audio_id, user_id } = req.body;
        const newEffect = await createEffect(effects, audio_id, user_id);
        res.status(200).json(newEffect);
    } catch (error) {
        res.status(404).json({ error: error });
    }
});

// DELETE AN EFFECT
effects.delete("/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const deletedEffect = await deleteEffect(effects, audio_id, user_id);
        res.status(200).json(deletedEffect);
    } catch (error) {
        res.status(404).json({ error: error });
    }
});

// CHECK AUDIO AND USER
effects.get(
    "/exist/:audio_id/:user_id",
    authenticateToken,
    async (req, res) => {
        const { audio_id, user_id } = req.params;
        try {
            const doesExist = await hasEffects(audio_id, user_id);
            res.status(200).json(doesExist);
        } catch (error) {
            res.status(404).json({ error: error });
        }
    }
);

// EXPORT
module.exports = effects;
