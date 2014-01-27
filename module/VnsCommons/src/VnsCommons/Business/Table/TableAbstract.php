<?php

namespace VnsCommons\Business\Table;

use Zend\Db\TableGateway\TableGateway;

class TableAbstract
{
    /**
     * @var TableGateway
     */
    protected $tableGateway;

    /**
     * @var string
     */
    protected $_primary; // Guarda o nome da coluna primary key
    
    public function getPrimary()
    {
        return $this->_primary;
    }
    
    public function __construct(TableGateway $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }
    
    public function fetchOne($where)
    {
        $object = $this->tableGateway->select($where)->current();
        if (!$object)
            return false;
        
        return $object;
    }
    
    public function fetchOneWithRelationship($where)
    {

    }
    
    public function fetchAll($where = null)
    {
        $resultSet = $this->tableGateway->select($where);
        return $resultSet;
    }
    
    public function fetchAllWithRelationship($where = null)
    {

    }
    
    public function insert($dados)
    {
        if(!$this->tableGateway->insert($dados))
            return false;
        
        return $this->tableGateway->getLastInsertValue();
    }
    
    public function update($dados,$where)
    {
        $affectedRows = $this->tableGateway->update($dados,$where);
        return $affectedRows;
    }
    
    public function delete($where)
    {
        $affectedRows = $this->tableGateway->delete($where);
        return $affectedRows;
    }
}