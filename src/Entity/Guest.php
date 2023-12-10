<?php

namespace App\Entity;

use App\Repository\GuestRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: GuestRepository::class)]
class Guest
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $fname = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $lname = null;

    #[ORM\Column(nullable: true)]
    private ?int $phone = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $email = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\OneToMany(mappedBy: 'guest', targetEntity: AnketaResult::class)]
    private Collection $anketaResults;

    public function __construct()
    {
        $this->anketaResults = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFname(): ?string
    {
        return $this->fname;
    }

    public function setFname(?string $fname): static
    {
        $this->fname = $fname;

        return $this;
    }

    public function getLname(): ?string
    {
        return $this->lname;
    }

    public function setLname(?string $lname): static
    {
        $this->lname = $lname;

        return $this;
    }

    public function getPhone(): ?int
    {
        return $this->phone;
    }

    public function setPhone(?int $phone): static
    {
        $this->phone = $phone;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    /**
     * @return Collection<int, AnketaResult>
     */
    public function getAnketaResults(): Collection
    {
        return $this->anketaResults;
    }

    public function addAnketaResult(AnketaResult $anketaResult): static
    {
        if (!$this->anketaResults->contains($anketaResult)) {
            $this->anketaResults->add($anketaResult);
            $anketaResult->setGuest($this);
        }

        return $this;
    }

    public function removeAnketaResult(AnketaResult $anketaResult): static
    {
        if ($this->anketaResults->removeElement($anketaResult)) {
            // set the owning side to null (unless already changed)
            if ($anketaResult->getGuest() === $this) {
                $anketaResult->setGuest(null);
            }
        }

        return $this;
    }
}
