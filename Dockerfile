# Utiliser une image Debian stable
FROM debian:bookworm

# Mettre à jour les paquets et installer git, curl et python
RUN apt-get update && apt-get install -y \
    git \
    curl \
    python3 \
    python3-pip \
    && apt-get clean

# Définir le répertoire de travail
WORKDIR /app

# Copier le projet dans le conteneur
COPY . /app

# Commande par défaut
CMD ["bash"]
