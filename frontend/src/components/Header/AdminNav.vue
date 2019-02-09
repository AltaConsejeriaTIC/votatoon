<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <router-link class="navbar-brand" :to="{ name: 'Home' }">Inicio</router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link class="nav-link" :to="{ name: 'Schools' }">Administrar Colegios</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{ name: 'SchoolCandidates' }">Administrar Candidatos</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{ name: 'SchoolVoters' }">Votantes</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>
