-- phpMyAdmin SQL Dump
-- version 5.0.4deb2+deb11u2
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : ven. 10 juil. 2026 à 13:52
-- Version du serveur :  10.5.29-MariaDB-0+deb11u1
-- Version de PHP : 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `discord_night_club`
--

-- --------------------------------------------------------

--
-- Structure de la table `t_admin_lvl`
--

CREATE TABLE `t_admin_lvl` (
  `id_lvl` int(11) NOT NULL,
  `name_lvl` varchar(20) DEFAULT NULL,
  `id_role` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `t_admin_lvl`
--


-- --------------------------------------------------------

--
-- Structure de la table `t_roles_grades`
--

CREATE TABLE `t_roles_grades` (
  `id_role` varchar(20) NOT NULL,
  `id_channel` varchar(20) DEFAULT NULL,
  `emoji` varchar(20) DEFAULT NULL,
  `name` varchar(20) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `t_roles_grades`
--


-- --------------------------------------------------------

--
-- Structure de la table `t_roles_jeux`
--

CREATE TABLE `t_roles_jeux` (
  `id_role` varchar(20) NOT NULL,
  `emoji` varchar(20) DEFAULT NULL,
  `name` varchar(20) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `t_ticket`
--

CREATE TABLE `t_ticket` (
  `id_ticket` int(11) NOT NULL,
  `id_salon` varchar(20) DEFAULT NULL,
  `id_author` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `t_ticket`
--


-- --------------------------------------------------------

--
-- Structure de la table `t_user`
--

CREATE TABLE `t_user` (
  `id_user` varchar(20) NOT NULL,
  `id_cr` varchar(20) DEFAULT NULL,
  `id_coc` varchar(20) DEFAULT NULL,
  `admin_lvl` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `t_user`
--


-- --------------------------------------------------------

--
-- Structure de la table `t_voc_channel`
--

CREATE TABLE `t_voc_channel` (
  `id_channel` varchar(20) NOT NULL,
  `id_author` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `t_admin_lvl`
--
ALTER TABLE `t_admin_lvl`
  ADD PRIMARY KEY (`id_lvl`);

--
-- Index pour la table `t_roles_grades`
--
ALTER TABLE `t_roles_grades`
  ADD PRIMARY KEY (`id_role`);

--
-- Index pour la table `t_roles_jeux`
--
ALTER TABLE `t_roles_jeux`
  ADD PRIMARY KEY (`id_role`);

--
-- Index pour la table `t_ticket`
--
ALTER TABLE `t_ticket`
  ADD PRIMARY KEY (`id_ticket`),
  ADD KEY `id_author` (`id_author`);

--
-- Index pour la table `t_user`
--
ALTER TABLE `t_user`
  ADD PRIMARY KEY (`id_user`),
  ADD KEY `admin_lvl` (`admin_lvl`);

--
-- Index pour la table `t_voc_channel`
--
ALTER TABLE `t_voc_channel`
  ADD PRIMARY KEY (`id_channel`),
  ADD KEY `id_author` (`id_author`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `t_ticket`
--
ALTER TABLE `t_ticket`
  MODIFY `id_ticket` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `t_ticket`
--
ALTER TABLE `t_ticket`
  ADD CONSTRAINT `t_ticket_ibfk_1` FOREIGN KEY (`id_author`) REFERENCES `t_user` (`id_user`);

--
-- Contraintes pour la table `t_user`
--
ALTER TABLE `t_user`
  ADD CONSTRAINT `t_user_ibfk_1` FOREIGN KEY (`admin_lvl`) REFERENCES `t_admin_lvl` (`id_lvl`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
