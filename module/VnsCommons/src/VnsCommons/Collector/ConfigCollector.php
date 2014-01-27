<?php
namespace VnsCommons\Collector;

use Zend\Mvc\MvcEvent;

/**
 * Collector to be used in ZendDeveloperTools to record and display personal information
 *
 * @license MIT
 * @author  Vinicius Garcia <vinigarcia87@gmail.com>
 */
class ConfigCollector extends \ZendDeveloperTools\Collector\AbstractCollector
{

    /**
     * {@inheritDoc}
     */
    public function getName()
    {
        return 'vnscommons_configs';
    }

    /**
     * {@inheritDoc}
     */
    public function getPriority()
    {
        return 10;
    }

    /**
     * {@inheritDoc}
     */
    public function collect(MvcEvent $mvcEvent)
    {
    	$date = new \DateTime();
    	
        $this->data = array(
        	'environment' => ucfirst(getenv('APPLICATION_ENV') ?: 'production'),
        	'timezone' => $date->getTimezone()->getName(),
        	'defaultlocale' => \Locale::getDefault(),
        );
    }
    
    /**
     * Returns the environment
     *
     * @return string
     */
    public function getEnvironment()
    {
    	return $this->data['environment'];
    }
    
    /**
     * Returns the timezone
     *
     * @return string
     */
    public function getTimeZone()
    {
    	return $this->data['timezone'];
    }
    
    /**
     * Returns the default locale
     *
     * @return string
     */
    public function getDefaultLocale()
    {
    	return $this->data['defaultlocale'];
    }
}
