const PORT = process.env.PORT;

module.exports = {
    openapi: '3.0.0',
    info: {
        title: 'ETNAir API',
        version: '1.0.0',
        description: 'Documentation de l\'API'
    },
    servers: [
        {
            url: `http://localhost:${PORT}/api`,
            description: 'Développement'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },
        schemas: {
            User: {
                type: 'object',
                properties: {
                    iduser: { type: 'integer' },
                    email: { type: 'string' },
                    username: { type: 'string' },
                    usertype: { type: 'string', enum: ['LOCATOR', 'OWNER'] }
                }
            },
            Home: {
                type: 'object',
                properties: {
                    idhome: { type: 'integer' },
                    namehome: { type: 'string' },
                    description: { type: 'string' },
                    price: { type: 'number' },
                    iduser: { type: 'integer' }
                }
            },
            Error: {
                type: 'object',
                properties: {
                    error: { type: 'string' }
                }
            }
        }
    },
    paths: {
        '/auth/register': {
            post: {
                tags: ['Authentification'],
                summary: 'Inscription',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password', 'username'],
                                properties: {
                                    email: { type: 'string' },
                                    password: { type: 'string' },
                                    username: { type: 'string' },
                                    usertype: { type: 'string', default: 'LOCATOR' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': { description: 'Inscription réussie' },
                    '400': { description: 'Erreur de validation' }
                }
            }
        },
        '/auth/login': {
            post: {
                tags: ['Authentification'],
                summary: 'Connexion',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password'],
                                properties: {
                                    email: { type: 'string' },
                                    password: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Connexion réussie' },
                    '401': { description: 'Identifiants invalides' }
                }
            }
        },
        '/user/profile': {
            get: {
                tags: ['Utilisateur'],
                summary: 'Récupérer le profil',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Profil récupéré',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        user: { $ref: '#/components/schemas/User' }
                                    }
                                }
                            }
                        }
                    },
                    '401': { description: 'Non authentifié' },
                    '404': { description: 'Utilisateur non trouvé' },
                    '500': { description: 'Erreur serveur' }
                }
            },
            put: {
                tags: ['Utilisateur'],
                summary: 'Modifier le profil',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string' },
                                    username: { type: 'string' },
                                    usertype: { type: 'string', enum: ['LOCATOR', 'OWNER'] }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Profil modifié',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        user: { $ref: '#/components/schemas/User' }
                                    }
                                }
                            }
                        }
                    },
                    '401': { description: 'Non authentifié' },
                    '404': { description: 'Utilisateur non trouvé' },
                    '500': { description: 'Erreur serveur' }
                }
            },
            delete: {
                tags: ['Utilisateur'],
                summary: 'Supprimer le profil',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Profil supprimé',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Profil supprimé avec succès' }
                                    }
                                }
                            }
                        }
                    },
                    '401': { description: 'Non authentifié' },
                    '500': { description: 'Erreur serveur' }
                }
            }
        },
        '/home': {
            post: {
                tags: ['Logements'],
                summary: 'Créer un logement',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['namehome', 'description', 'price'],
                                properties: {
                                    namehome: { type: 'string', example: 'Appartement centre-ville' },
                                    description: { type: 'string', example: 'Bel appartement lumineux avec vue' },
                                    price: { type: 'number', example: 850.50 }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Logement créé avec succès',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Enregistrement du logement réussi' },
                                        home: { $ref: '#/components/schemas/Home' }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Données invalides',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' }
                            }
                        }
                    },
                    '401': { description: 'Non authentifié' },
                    '500': { description: 'Erreur serveur' }
                }
            }
        },
        '/homes': {
            get: {
                tags: ['Logements'],
                summary: 'Récupérer tous les logements',
                responses: {
                    '200': {
                        description: 'Liste des logements',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        homes: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Home' }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': { description: 'Erreur serveur' }
                }
            }
        },
        '/homes/{id}': {
            get: {
                tags: ['Logements'],
                summary: 'Récupérer un logement par ID',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' },
                        description: 'ID du logement'
                    }
                ],
                responses: {
                    '200': {
                        description: 'Logement trouvé',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        home: { $ref: '#/components/schemas/Home' }
                                    }
                                }
                            }
                        }
                    },
                    '404': {
                        description: 'Domicile non trouvé',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' }
                            }
                        }
                    },
                    '500': { description: 'Erreur serveur' }
                }
            },
            put: {
                tags: ['Logements'],
                summary: 'Modifier un logement',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' },
                        description: 'ID du logement'
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    namehome: { type: 'string' },
                                    description: { type: 'string' },
                                    price: { type: 'number' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Logement modifié',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        home: { $ref: '#/components/schemas/Home' }
                                    }
                                }
                            }
                        }
                    },
                    '401': { description: 'Non authentifié' },
                    '403': {
                        description: 'Non autorisé',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' }
                            }
                        }
                    },
                    '404': {
                        description: 'Logement non trouvé',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' }
                            }
                        }
                    },
                    '500': { description: 'Erreur serveur' }
                }
            },
            delete: {
                tags: ['Logements'],
                summary: 'Supprimer un logement',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' },
                        description: 'ID du logement'
                    }
                ],
                responses: {
                    '200': {
                        description: 'Logement supprimé',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Logement supprimé avec succès' }
                                    }
                                }
                            }
                        }
                    },
                    '401': { description: 'Non authentifié' },
                    '403': {
                        description: 'Non autorisé',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' }
                            }
                        }
                    },
                    '404': {
                        description: 'Logement non trouvé',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' }
                            }
                        }
                    },
                    '500': { description: 'Erreur serveur' }
                }
            }
        }
    }
};