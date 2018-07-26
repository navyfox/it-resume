<?php

/**
 * @file
 * Contains \Drupal\api_v2\Controller\TestAPIController.
 */

namespace Drupal\api_v2\Controller;

use Drupal\Core\Controller\ControllerBase;

use Drupal\node\NodeInterface;
use Drupal\rest\ResourceResponse;
use Drupal\taxonomy\Entity\Term;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use \Drupal\node\Entity\Node;
use \Drupal\file\Entity\File;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

use Drupal\Core\Url;
use Psr\Log\LoggerInterface;

/**
 * Controller routines for test_api routes.
 */
class TestAPIController extends ControllerBase {


  /**
   * A current user instance.
   *
   * @var \Drupal\Core\Session\AccountProxyInterface
   */
  protected $currentUser;

  /**
   * Default limit entities per request.
   */
  protected $limit = 16;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
        $container->getParameter('serializer.formats'),
        $container->get('logger.factory')->get('demo_resource'),
        $container->get('current_user')
    );
  }

  /**
   * Responds to GET requests.
   */
  public function get_resume() {
//    if (!$this->currentUser->hasPermission('access content')) {
//      throw new AccessDeniedHttpException();
//    }

    $response = [
        'items' => [],
        'next_page' => FALSE,
        'prev_page' => FALSE,
    ];
    $request = \Drupal::request();
    $request_query = $request->query;
    $request_query_array = $request_query->all();
    $limit = $request_query->get('limit') ?: $this->limit;
    $page = $request_query->get('page') ?: 0;

    // Find out how many articles do we have.
    $query = \Drupal::entityQuery('node')->condition('type', 'resume');
    $articles_count = $query->count()->execute();
    $position = $limit * ($page + 1);
    if ($articles_count > $position) {
      $next_page_query = $request_query_array;
      $next_page_query['page'] = $page + 1;
      $response['next_page'] = Url::createFromRequest($request)
          ->setOption('query', $next_page_query)
          ->toString(TRUE)
          ->getGeneratedUrl();
    }

    if ($page > 0) {
      $prev_page_query = $request_query_array;
      $prev_page_query['page'] = $page - 1;
      $response['prev_page'] = Url::createFromRequest($request)
          ->setOption('query', $prev_page_query)
          ->toString(TRUE)
          ->getGeneratedUrl();
    }

    // Find articles.
    $query = \Drupal::entityQuery('node')
        ->condition('type', 'resume')
        ->sort('created', 'DESC')
        ->pager($limit);
    $result = $query->execute();
    $articles = \Drupal::entityTypeManager()
        ->getStorage('node')
        ->loadMultiple($result);

    // Create Response
    /** @var \Drupal\node\Entity\Node $article */
    foreach ($articles as $article) {
      $response_item = [
          'id'    => $article->id(),
          'title' => $article->label(),
          'text'  => $article->field_text->value,
          'name' => $article->field_name->value,
      ];
      foreach($article->field_tags->getIterator() as $tagItem) {
        $term = Term::load($tagItem->target_id);
        $response_item['field_tags'][] = [
            'id'   => $term->id(),
            'name' => $term->getName(),
        ];
      }
      $response['items'][] = $response_item ;
    }

    return new JsonResponse($response, 200);
  }

  /**
   * Generated Url image
   */
  private function generated_url_images (NodeInterface $node) {
    $file = $node->field_ava->entity;
    if ($file) {
      $url = \Drupal\image\Entity\ImageStyle::load('original')->buildUrl($file->getFileUri());
      return $url;
    } else {
      return "http://cms.it-resume.local:8080/sites/default/files/2018-07/trump.png";
    }
  }
  /**
   * Generated relative Url image
   */
  private function generated_relative_url_images (NodeInterface $node) {
    $file = $node->field_ava->entity;
    if ($file) {
      $url = \Drupal\image\Entity\ImageStyle::load('original')->buildUrl($file->getFileUri());
      return file_url_transform_relative($url);
    } else {
      return NULL;
    }
  }

  /**
   * Get item resume
   */
  public function get_item_resume (NodeInterface $node) {
    $image = $this->generated_url_images($node);
    $response_item = [
        'id'    => $node->id(),
        'title' => $node->label(),
        'text'  => $node->field_text->value,
        'name' => $node->field_name->value,
        'image' => $image,
    ];
    foreach($node->field_tags->getIterator() as $tagItem) {
      $term = Term::load($tagItem->target_id);
      $response_item['field_tags'][] = [
          'id'   => $term->id(),
          'name' => $term->getName(),
      ];
    }
    $response['item'] = $response_item ;
    return new JsonResponse( $response );
  }

  /**
   * Search items resume by id tags
   */
  public function search_resume_by_id_skill_tags (Request $request) {

    // This condition checks the `Content-type` and makes sure to
    // decode JSON string from the request body into array.
    if ( 0 === strpos( $request->headers->get( 'Content-Type' ), 'application/json' ) ) {
      $data = json_decode( $request->getContent(), TRUE );
      $request->request->replace( is_array( $data ) ? $data : [] );
    }
    $response = [
        'items' => [],
        'next_page' => FALSE,
        'prev_page' => FALSE,
    ];

    $request = \Drupal::request();
    $request_query = $request->query;
    $request_query_array = $request_query->all();
    $limit = $request_query->get('limit') ?: $this->limit;
    $page = $request_query->get('page') ?: 0;

    $query_array = $data['skills_tags'];

    $query = $this->sql_query_resume_by_array_id_tags($query_array);

    // Find out how many articles do we have.
    $articles_count = $query->count()->execute();
    $position = $limit * ($page + 1);
    if ($articles_count > $position) {
      $next_page_query = $request_query_array;
      $next_page_query['page'] = $page + 1;
      $response['next_page'] = Url::createFromRequest($request)
          ->setOption('query', $next_page_query)
          ->toString(TRUE)
          ->getGeneratedUrl();
    }
    if ($page > 0) {
      $prev_page_query = $request_query_array;
      $prev_page_query['page'] = $page - 1;
      $response['prev_page'] = Url::createFromRequest($request)
          ->setOption('query', $prev_page_query)
          ->toString(TRUE)
          ->getGeneratedUrl();
    }

    // Find articles.
    $query = $this->sql_query_resume_by_array_id_tags($query_array);

    $result = $query->sort('created', 'DESC')->pager($limit)->execute();
    $articles = \Drupal::entityTypeManager()
        ->getStorage('node')
        ->loadMultiple($result);

    // Create Response
    /** @var \Drupal\node\Entity\Node $article */
    foreach ($articles as $article) {
      $image = $this->generated_url_images($article);
      $response_item = [
          'id'    => $article->id(),
          'title' => $article->label(),
          'text'  => $article->field_text->value,
          'name' => $article->field_name->value,
          'image' => $image,
      ];
      foreach($article->field_tags->getIterator() as $tagItem) {
        $term = Term::load($tagItem->target_id);
        $response_item['field_tags'][] = [
            'id'   => $term->id(),
            'name' => $term->getName(),
        ];
      }
      $response['items'][] = $response_item ;
    }
    return new JsonResponse( $response );
  }

  private function sql_query_resume_by_array_id_tags(array $query_array) {
    $query = \Drupal::entityQuery('node')
        ->condition('type', 'resume');

    foreach ($query_array as $id_tag ) {
      $and = $query->andConditionGroup();
      $and->condition('field_tags', $id_tag);
      $query->condition($and);
    }
    return $query;
  }


  /**
   * Create new resume.
   */
  public function post_resume( Request $request ) {
    // This condition checks the `Content-type` and makes sure to
    // decode JSON string from the request body into array.
    if ( 0 === strpos( $request->headers->get( 'Content-Type' ), 'application/json' ) ) {
      $data = json_decode( $request->getContent(), TRUE );
      $request->request->replace( is_array( $data ) ? $data : [] );
    }

//TODO post method
    $name_tag = 'term name that you want to add';

    $response['status'] = true;
    $response['method'] = 'POST';

    $node = Node::create([
        'type'        => 'resume',
        'title'       => $data['title'],
        'field_text'  => $data['text'],
        'field_name'  => $data['name'],
//        'field_tags' => array(
//            array( 'target_id' => $data['tags'] ),
//        ),
//        'field_tags'  => $data['tags'],
    ]);
    $node->set('field_tags', $data['tags']);
    $node->save();

    $cat = 'brrr... winter is comming';
    $terms = taxonomy_term_load_multiple_by_name($cat);
    $ctids = array();
    if($terms == NULL) { //Create term and use
      $created = $this->_create_skills_tag($cat);
      if($created) {
//finding term by name
        $newTerm = taxonomy_term_load_multiple_by_name($cat);
        foreach($newTerm as $key => $term) {
          $ctids[] = $key;
        }
      }
    }


    return new JsonResponse( $response );
  }


  /**
   * @param $name
   * @return bool
   */
  private function _create_skills_tag($name) {
    $term = Term::create([
        'name' => $name,
        'vid' => 'skills_tag',
    ])->save();
    return TRUE;
  }

  /**
   * Get search tags name and id by substring for a name.
   */
  public function search_skill_tags_by_substring_for_a_name() {
    $request = \Drupal::request();
    $query = $request->query->get('query');

    $sql_query = \Drupal::entityQuery('taxonomy_term')
        ->condition('name', "$query%", 'LIKE')
        ->condition('vid', 'skills_tag')
        ->execute();

    $terms = \Drupal::entityTypeManager()
        ->getStorage('taxonomy_term')
        ->loadMultiple($sql_query);

    $response = array();
    foreach($terms as $key => $term) {
      $item = array(
        'value' => $key,
        'label' => $term->getName()
      );
      $response['terms'][] = $item;
    }

    return new JsonResponse( $response );
  }

  /**
   * Callback for `my-api/edit` API method.
   */
  public function edit_resume( NodeInterface $node, Request $request ) {
    // This condition checks the `Content-type` and makes sure to
    // decode JSON string from the request body into array.
    if ( 0 === strpos( $request->headers->get( 'Content-Type' ), 'application/json' ) ) {
      $data = json_decode( $request->getContent(), TRUE );
      $request->request->replace( is_array( $data ) ? $data : [] );
    }

    //TODO edit method

    $node->title = $data['title'];
    $node->body = $data['body'];
    $node->field_name = $data['field_name'];
    $node->save();

    $response['status'] = true;
    $response['method'] = 'POST';

    return new JsonResponse( $response );
  }

}
