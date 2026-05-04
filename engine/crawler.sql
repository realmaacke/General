USE general;

DROP TABLE IF EXISTS crawler_content_hash;
DROP TABLE IF EXISTS crawler_seen_urls;
DROP TABLE IF EXISTS crawler_frontier;
DROP TABLE IF EXISTS crawled_sites;



CREATE TABLE crawler_content_hash (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hash VARCHAR(255) NOT NULL,
    UNIQUE KEY (hash)
) ENGINE=InnoDB;


CREATE TABLE crawler_seen_urls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url_hash VARCHAR(255) NOT NULL,
    url VARCHAR(512) NOT NULL,
    UNIQUE KEY (url_hash),
    INDEX idx_url (url)
) ENGINE=InnoDB;


CREATE TABLE crawler_frontier (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url_hash VARCHAR(255) NOT NULL,
    url VARCHAR(512) NOT NULL,
    search_depth INT NOT NULL,
    status ENUM('pending','processing','done','failed') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY (url_hash),
    INDEX idx_status_id (status, id)
) ENGINE=InnoDB;


CREATE TABLE crawled_sites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(512) NOT NULL,
    title TEXT,
    text LONGTEXT,
    anchors LONGTEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    indexed TINYINT(1) NOT NULL DEFAULT 0,

    UNIQUE KEY (url(255)),
    INDEX idx_indexed (indexed)
) ENGINE=InnoDB;