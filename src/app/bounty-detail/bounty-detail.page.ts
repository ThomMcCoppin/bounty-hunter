import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'


@Component({
  selector: 'app-bounty-detail',
  templateUrl: './bounty-detail.page.html',
  styleUrls: ['./bounty-detail.page.scss'],
})
export class BountyDetailPage implements OnInit {
  public bountyId: number;
  public bounties: any;
  public bountyDetails: any;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.findDetails();
  }

  findDetails() {
    this.bountyId = + this.route.snapshot.paramMap.get('id');

    this.bounties = localStorage.getItem('bounties');
    
    this.bounties = JSON.parse(this.bounties);

    this.bountyDetails = this.bounties.find(bounty => bounty.id === this.bountyId)

  }

  startHunt() {
    this.router.navigateByUrl("/bounty-active")
  }

}
