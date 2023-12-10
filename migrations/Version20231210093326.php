<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231210093326 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE anketa_result (id INT AUTO_INCREMENT NOT NULL, guest_id INT DEFAULT NULL, name_anketa VARCHAR(255) DEFAULT NULL, question VARCHAR(255) DEFAULT NULL, response VARCHAR(255) DEFAULT NULL, INDEX IDX_9F72EF159A4AA658 (guest_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE anketa_result ADD CONSTRAINT FK_9F72EF159A4AA658 FOREIGN KEY (guest_id) REFERENCES guest (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE anketa_result DROP FOREIGN KEY FK_9F72EF159A4AA658');
        $this->addSql('DROP TABLE anketa_result');
    }
}
