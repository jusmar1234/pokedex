const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const router = express.Router();
const API_URL = process.env.API_URL;
router.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=50");
    const pokemonList = await Promise.all(
      response.data.results.map(async (pokemon) => {
        const details = await axios.get(pokemon.url); // Fetch individual Pokémon data
        return {
          name: pokemon.name,
          id: details.data.id,
          type: details.data.types.map((t) => t.type.name).join(", "), // Get Pokémon type(s)
          image: details.data.sprites.other["official-artwork"].front_default,
        };
      })
    );

    res.render("pages/home", { pokemonList });
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
    res.status(500).send("Error fetching Pokémon");
  }
});

module.exports = router;


router.get("/pokemon/:name", async (req, res) => {
    try {
        const { name } = req.params;
        const response = await axios.get(`${API_URL}/${name}`);
        return res.render("pages/details", { pokemon: response.data});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
        
    }
});

router.get("/search", async (req, res) => {
    try {
        const { name } = req.query;
        if(!name)return res.redirect("/");
        const response = await axios.get(`${API_URL}/${name.toLowerCase()}`);
        return res.render("pages/details", { pokemon: response.data});

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
        
    }
});

module.exports = router;