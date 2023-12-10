<?php

namespace App\Entity;

use App\Repository\AnketaResultRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AnketaResultRepository::class)]
class AnketaResult
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $name_anketa = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $question = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $response = null;

    #[ORM\ManyToOne(inversedBy: 'anketaResults')]
    private ?Guest $guest = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNameAnketa(): ?string
    {
        return $this->name_anketa;
    }

    public function setNameAnketa(?string $name_anketa): static
    {
        $this->name_anketa = $name_anketa;

        return $this;
    }

    public function getQuestion(): ?string
    {
        return $this->question;
    }

    public function setQuestion(?string $question): static
    {
        $this->question = $question;

        return $this;
    }

    public function getResponse(): ?string
    {
        return $this->response;
    }

    public function setResponse(?string $response): static
    {
        $this->response = $response;

        return $this;
    }

    public function getGuest(): ?Guest
    {
        return $this->guest;
    }

    public function setGuest(?Guest $guest): static
    {
        $this->guest = $guest;

        return $this;
    }
}
