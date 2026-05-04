USE general;

DROP TABLE IF EXISTS inverted_index_postings;
DROP TABLE IF EXISTS inverted_index;
DROP TABLE IF EXISTS document_meta;
DROP TABLE IF EXISTS doc_lengths;
DROP TABLE IF EXISTS index_state;

CREATE TABLE inverted_index (
    term VARCHAR(191) PRIMARY KEY,
    df INT NOT NULL DEFAULT 0,
    INDEX idx_df (df)
) ENGINE=InnoDB;

CREATE TABLE inverted_index_postings (
    term VARCHAR(191),
    doc_url VARCHAR(512),
    tf INT NOT NULL,

    PRIMARY KEY (term, doc_url),
    INDEX idx_doc_url (doc_url),
    INDEX idx_term (term)
) ENGINE=InnoDB;

CREATE TABLE document_meta (
    url VARCHAR(512) PRIMARY KEY,
    title TEXT,
    snippet TEXT
) ENGINE=InnoDB;

CREATE TABLE doc_lengths (
    url VARCHAR(512) PRIMARY KEY,
    length INT NOT NULL
) ENGINE=InnoDB;



CREATE TABLE index_state (
    id TINYINT PRIMARY KEY,
    dirty BOOLEAN NOT NULL DEFAULT 1,
    last_indexed TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO index_state (id, dirty, last_indexed)
VALUES (1, 1, NULL);