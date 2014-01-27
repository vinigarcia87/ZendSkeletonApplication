<?php

namespace VnsExperimental\Business\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Entity Class representando uma classe generica foo
 *
 * @ORM\Entity
 * @ORM\Table(name="exp_foo")
 * @property int $id
 * @property string $nome
 * @property string $descricao
 */
class Foo
{
	/**
	 * Primary Identifier
	 *
	 * @ORM\Id
	 * @ORM\Column(type="integer")
	 * @ORM\GeneratedValue(strategy="AUTO")
	 * @var integer
	 * @access protected
	 */
	private $id;

	/**
	 * @ORM\Column(type="string", length=100)
	 * @var string
	 * @access protected
	 */
	private $nome;

	/**
	 * @ORM\Column(type="string", length=255)
	 * @var string
	 * @access protected
	 */
	private $descricao;

	// Getters & Setters
	// ===============================================

	/**
	 * Get id
	 *
	 * @return integer
	 */
	public function getId()
	{
		return $this->id;
	}

	/**
	 * Set nome
	 *
	 * @param string $catNome
	 * @return Categoria
	 */
	public function setNome($catNome)
	{
		$this->nome = $catNome;

		return $this;
	}

	/**
	 * Get nome
	 *
	 * @return string
	 */
	public function getNome()
	{
		return $this->nome;
	}

	/**
	 * Set descricao
	 *
	 * @param string $catDescricao
	 * @return Categoria
	 */
	public function setDescricao($catDescricao)
	{
		$this->descricao = $catDescricao;

		return $this;
	}

	/**
	 * Get descricao
	 *
	 * @return string
	 */
	public function getDescricao()
	{
		return $this->descricao;
	}
}
